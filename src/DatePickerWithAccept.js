import useControlled from '@mui/utils/useControlled';
import { useMemo } from 'react';
import { DatePicker } from '@mui/x-date-pickers';

// debounce function
function debounce(func, wait = 500) {
  let timeout;
  function debounced(...args) {
    const later = () => {
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  }

  debounced.clear = () => {
    clearTimeout(timeout);
  };

  return debounced;
}

export default function DatePickerWithAccept(props) {
  const { value: valueProp, onAccept, onChange, ...other } = props;

  const [value, setValue] = useControlled({
    name: 'FieldAcceptValue',
    state: 'value',
    controlled: valueProp,
    default: null,
  });

  // Debounced function needs to be memoized to keep the same timeout beween each render.
  // For the same reason, the `onAccept` needs to be wrapped in useCallback.
  const debouncedOnAccept = useMemo(() => debounce(onAccept, 1000), [onAccept]);

  return (
    <DatePicker
      value={value}
      onChange={(newValue, context) => {
        setValue(newValue);
        debouncedOnAccept(newValue);
        onChange?.(newValue, context);
      }}
      {...other}
    />
  );
}
