import { useEffect, useState } from "react";

const TagInput = (props) => {
  const [tagInput, setTagInput] = useState('');

  // set event listener for Enter key
  useEffect(() => {
    const enterKeyListener = (e) => {
      if ((e.code === 'Enter' || e.code === 'NumpadEnter')) {
        e.preventDefault();
        if(e.target.value !== ""){
          props.handleSubmit(tagInput);
          setTagInput('');
        }
      }
    };
    document.addEventListener("keydown", enterKeyListener);
    return () => {
      document.removeEventListener("keydown", enterKeyListener);
    }
  }, [props, tagInput])

  const handleChange = (input) => {
    setTagInput(input);
  }

  return (
    <form onSubmit={e => props.handleSubmit(e)}>
      <input type='text'
        placeholder='Add a tag'
        value={tagInput}
        key={props.studentId}
        onChange={(e) => handleChange(e.target.value)} >
      </input>
    </form>
  )
}

export default TagInput;