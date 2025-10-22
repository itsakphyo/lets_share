from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_config
from app.core.database import init_database, close_database

config = get_config()

AVAILABLE_ROUTERS = []
ROUTER_ERRORS = []

try:
    from app.api.routes.auth import router as auth_router
    AVAILABLE_ROUTERS.append(("auth", auth_router, "/auth", ["authentication"]))
except ImportError as e:
    ROUTER_ERRORS.append(f"auth: {e}")
try:
    from app.api.routes.posts import router as posts_router
    AVAILABLE_ROUTERS.append(("posts", posts_router, "", ["posts"]))
except ImportError as e:
    ROUTER_ERRORS.append(f"posts: {e}")

@asynccontextmanager
async def lifespan(app: FastAPI):

    if ROUTER_ERRORS:
        print("Some routers could not be imported:")
        for error in ROUTER_ERRORS:
            print(f"   - {error}")

    try:
        # Initialize database
        await init_database()
    except Exception as e:
        print(f"Database initialization failed: {e}")
        raise
    
    print(f"Application started successfully")

    yield
    
    # Shutdown
    try:
        await close_database()
    except Exception as e:
        print(f"Database shutdown error: {e}")

    print("Shutdown complete")

app = FastAPI(
    title=config.app.name,
    description="Let's Share platform API",
    version="1.0.0",
    docs_url="/docs" if config.is_development() else None,
    redoc_url="/redoc" if config.is_development() else None,
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include available routers
for name, router, prefix, tags in AVAILABLE_ROUTERS:
    app.include_router(router, prefix=prefix, tags=tags)


if __name__ == "__main__":
    import uvicorn
    
    print(f"Starting {config.app.name} server...")
    uvicorn.run(
        "main:app",
        host=config.server.host,
        port=config.server.port,
        reload=config.is_development(),
        workers=1 if config.is_development() else config.server.workers
    )