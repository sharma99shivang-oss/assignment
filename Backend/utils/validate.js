const validateTask = (data) => {
  if (!data.title) {
    return 'Title is required';
  }
  if (data.title.length < 3) {
    return 'Title must be at least 3 characters';
  }
  return null;
};

module.exports = validateTask;