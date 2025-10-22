import { useState, useCallback } from 'react';

// Define types locally since they're not in the main types yet
interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
}

interface UseFormConfig<T extends Record<string, any>> {
  initialValues: T;
  validationRules?: Partial<Record<keyof T, ValidationRule[]>>;
  onSubmit?: (values: T) => Promise<void> | void;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

interface UseFormReturn<T extends Record<string, any>> {
  // Form values and state
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
  
  // Field handlers
  setValue: (field: keyof T, value: any) => void;
  setError: (field: keyof T, error: string) => void;
  setTouched: (field: keyof T, isTouched?: boolean) => void;
  
  // Form handlers
  handleChange: (field: keyof T) => (value: any) => void;
  handleBlur: (field: keyof T) => () => void;
  handleSubmit: (e?: React.FormEvent) => Promise<void>;
  
  // Utilities
  validateField: (field: keyof T, value?: any) => string | null;
  validateForm: () => boolean;
  resetForm: (newValues?: Partial<T>) => void;
  resetField: (field: keyof T) => void;
}

export const useForm = <T extends Record<string, any>>({
  initialValues,
  validationRules = {},
  onSubmit,
  validateOnChange = true,
  validateOnBlur = true,
}: UseFormConfig<T>): UseFormReturn<T> => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouchedState] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate a single field
  const validateField = useCallback((field: keyof T, value?: any): string | null => {
    const fieldValue = value !== undefined ? value : values[field];
    const rules = validationRules[field] || [];

    for (const rule of rules) {
      if (rule.required && (!fieldValue || fieldValue.toString().trim() === '')) {
        return `${String(field)} is required`;
      }

      if (rule.minLength && fieldValue && fieldValue.toString().length < rule.minLength) {
        return `${String(field)} must be at least ${rule.minLength} characters`;
      }

      if (rule.maxLength && fieldValue && fieldValue.toString().length > rule.maxLength) {
        return `${String(field)} must not exceed ${rule.maxLength} characters`;
      }

      if (rule.pattern && fieldValue && !rule.pattern.test(fieldValue.toString())) {
        return `${String(field)} format is invalid`;
      }

      if (rule.custom && fieldValue) {
        const customError = rule.custom(fieldValue.toString());
        if (customError) return customError;
      }
    }

    return null;
  }, [values, validationRules]);

  // Validate entire form
  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isFormValid = true;

    Object.keys(values).forEach((key) => {
      const field = key as keyof T;
      const error = validateField(field);
      if (error) {
        newErrors[field] = error;
        isFormValid = false;
      }
    });

    setErrors(newErrors);
    return isFormValid;
  }, [values, validateField]);

  // Set field value
  const setValue = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
    
    if (validateOnChange) {
      const error = validateField(field, value);
      setErrors(prev => ({ ...prev, [field]: error || undefined }));
    }
  }, [validateField, validateOnChange]);

  // Set field error
  const setError = useCallback((field: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  }, []);

  // Set field touched
  const setTouched = useCallback((field: keyof T, isTouched = true) => {
    setTouchedState(prev => ({ ...prev, [field]: isTouched }));
  }, []);

  // Handle field change
  const handleChange = useCallback((field: keyof T) => (value: any) => {
    setValue(field, value);
  }, [setValue]);

  // Handle field blur
  const handleBlur = useCallback((field: keyof T) => () => {
    setTouched(field, true);
    
    if (validateOnBlur) {
      const error = validateField(field);
      setErrors(prev => ({ ...prev, [field]: error || undefined }));
    }
  }, [setTouched, validateField, validateOnBlur]);

  // Handle form submission
  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    // Mark all fields as touched
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key as keyof T] = true;
      return acc;
    }, {} as Partial<Record<keyof T, boolean>>);
    setTouchedState(allTouched);
    
    // Validate form
    const isValid = validateForm();
    
    if (isValid && onSubmit) {
      try {
        await onSubmit(values);
      } catch (error) {
        // Handle submission error (can be extended)
        console.error('Form submission error:', error);
      }
    }
    
    setIsSubmitting(false);
  }, [values, isSubmitting, validateForm, onSubmit]);

  // Reset form
  const resetForm = useCallback((newValues?: Partial<T>) => {
    const resetValues = { ...initialValues, ...newValues };
    setValues(resetValues);
    setErrors({});
    setTouchedState({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Reset single field
  const resetField = useCallback((field: keyof T) => {
    setValues(prev => ({ ...prev, [field]: initialValues[field] }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
    setTouchedState(prev => ({ ...prev, [field]: false }));
  }, [initialValues]);

  // Computed properties
  const isValid = Object.values(errors).every(error => !error);
  const isDirty = Object.keys(values).some(key => 
    values[key as keyof T] !== initialValues[key as keyof T]
  );

  return {
    // Form values and state
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    isDirty,
    
    // Field handlers
    setValue,
    setError,
    setTouched,
    
    // Form handlers
    handleChange,
    handleBlur,
    handleSubmit,
    
    // Utilities
    validateField,
    validateForm,
    resetForm,
    resetField,
  };
};