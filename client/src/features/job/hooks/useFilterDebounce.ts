import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";

/**
 * Custom hook to handle debounced filter values for job search
 * @param initialValues - Initial filter values
 * @param debounceMs - Debounce delay in milliseconds
 * @returns Object containing current input values, debounced values, and setter functions
 */
export interface FilterValues {
  search: string;
  location: string;
  employmentType: string;
  isRemote: boolean;
}

export interface DebouncedFilterResult {
  // Current input values (for controlled inputs)
  inputValues: FilterValues;
  // Debounced values (for API calls)
  debouncedValues: FilterValues;
  // Setters for each filter
  setSearch: (value: string) => void;
  setLocation: (value: string) => void;
  setEmploymentType: (value: string) => void;
  setIsRemote: (value: boolean) => void;
  // Reset all filters
  resetFilters: () => void;
}

export function useFilterDebounce(
  initialValues: FilterValues = {
    search: "",
    location: "",
    employmentType: "",
    isRemote: false,
  },
  debounceMs: number = 500
): DebouncedFilterResult {
  // Current input values (for controlled inputs)
  const [inputValues, setInputValues] = useState<FilterValues>(initialValues);

  // Debounced values (for API calls)
  const [debouncedValues, setDebouncedValues] =
    useState<FilterValues>(initialValues);

  // Create a debounced function that updates all debounced values
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSetValues = useCallback(
    debounce((values: FilterValues) => {
      setDebouncedValues(values);
    }, debounceMs),
    [debounceMs]
  );

  // Update debounced values when input values change
  useEffect(() => {
    debouncedSetValues(inputValues);

    // Cancel the debounce on cleanup
    return () => {
      debouncedSetValues.cancel();
    };
  }, [inputValues, debouncedSetValues]);

  // Individual setters for each filter
  const setSearch = useCallback((value: string) => {
    setInputValues((prev) => ({ ...prev, search: value }));
  }, []);

  const setLocation = useCallback((value: string) => {
    setInputValues((prev) => ({ ...prev, location: value }));
  }, []);

  const setEmploymentType = useCallback((value: string) => {
    setInputValues((prev) => ({
      ...prev,
      employmentType: value === "all" ? "" : value,
    }));
  }, []);
  
  const setIsRemote = useCallback((value: boolean) => {
    setInputValues((prev) => ({ ...prev, isRemote: value }));
  }, []);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setInputValues({ search: "", location: "", employmentType: "", isRemote: false });
  }, []);

  return {
    inputValues,
    debouncedValues,
    setSearch,
    setLocation,
    setEmploymentType,
    setIsRemote,
    resetFilters,
  };
}
