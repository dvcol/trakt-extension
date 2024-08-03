export const addCustomProgressProperty = (progress = 0, throwOnError = false) => {
  try {
    window.CSS.registerProperty({
      name: '--progress',
      syntax: '<percentage>',
      inherits: true,
      initialValue: `${progress}%`,
    });
  } catch (error) {
    (throwOnError ? console.error : console.warn)('Failed to register custom CSS property: --progress', error);
    if (throwOnError) throw error;
  }
};
