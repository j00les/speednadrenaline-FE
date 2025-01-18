import PropTypes from 'prop-types';

const Dropdown = (props) => {
  const { options, value, onChange, id, placeholder } = props;

  return (
    <select
      id={id}
      value={value}
      onChange={onChange}
      required
      className="p-3 text-lg border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

Dropdown.propTypes = {
  options: PropTypes.array.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired
};

export default Dropdown;
