const allowedFields = ['party', 'item', 'qty', 'unit', 'rate', 'status', 'remarks'];
const validStatuses = ['pending', 'dispatched', 'hold', 'return'];
const requiredFields = ['party', 'item', 'qty', 'unit', 'rate'];

function validateOrderInput(input, { partial = false } = {}) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { error: 'Request body must be a JSON object.' };
  }

  const unknownFields = Object.keys(input).filter((field) => !allowedFields.includes(field));
  if (unknownFields.length > 0) {
    return { error: `Unsupported field: ${unknownFields[0]}.` };
  }

  if (Object.keys(input).length === 0) {
    return { error: 'Provide at least one order field to update.' };
  }

  if (!partial) {
    const missingField = requiredFields.find((field) => input[field] === undefined);
    if (missingField) {
      return { error: `${missingField} is required.` };
    }
  }

  for (const field of ['party', 'item', 'unit']) {
    if (input[field] !== undefined) {
      if (typeof input[field] !== 'string' || input[field].trim().length === 0) {
        return { error: `${field} must be a non-empty string.` };
      }
      const maxLength = field === 'unit' ? 20 : 120;
      if (input[field].trim().length > maxLength) {
        return { error: `${field} must be ${maxLength} characters or fewer.` };
      }
    }
  }

  if (input.remarks !== undefined &&
      (typeof input.remarks !== 'string' || input.remarks.length > 500)) {
    return { error: 'remarks must be a string of 500 characters or fewer.' };
  }

  if (input.qty !== undefined &&
      (typeof input.qty !== 'number' || !Number.isFinite(input.qty) || input.qty <= 0)) {
    return { error: 'qty must be a number greater than zero.' };
  }

  if (input.rate !== undefined &&
      (typeof input.rate !== 'number' || !Number.isFinite(input.rate) || input.rate < 0)) {
    return { error: 'rate must be a non-negative number.' };
  }

  if (input.status !== undefined && !validStatuses.includes(input.status)) {
    return { error: `status must be one of: ${validStatuses.join(', ')}.` };
  }

  return { value: input };
}

module.exports = { validateOrderInput };
