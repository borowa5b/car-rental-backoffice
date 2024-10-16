import { MatSnackBar } from '@angular/material/snack-bar';

export function handleErrors(errorResult: any, unknownErrorAction: () => {}) {
  if (errorResult.status === 400) {
    const errors = errorResult.error.errors;
    for (const error of errors) {
      const errorFieldName = error.fieldName;
      const errorField = document.querySelector(`#${errorFieldName}-error`);
      if (errorField) {
        errorField.innerHTML = error.message;
      }
    }
  } else {
    unknownErrorAction();
  }
}

export function clearErrors() {
  const errorFields = [
    ...document.querySelectorAll<HTMLElement>('[id$="-error"]'),
  ];
  for (const errorField of errorFields) {
    errorField.innerHTML = '';
  }
}
