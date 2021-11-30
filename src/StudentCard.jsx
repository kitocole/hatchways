import { useState } from "react";
import TagInput from "./TagInput";

const StudentCard = (props) => {
  const [viewDetails, setViewDetails] = useState(false);
  const [cardTags, setCardTags] = useState(props.tags);

  // show or hide grade details
  const showHideView = () => {
    setViewDetails(!viewDetails);
  }

  // destructure prop
  const { company, email, firstName, lastName, pic, skill } = props.student;
  // generate average score
  const grades = props.student.grades.map((element) => parseInt(element));
  const avg = grades.reduce((prev, current, idx) => {
    return ((prev * idx) + current) / (idx + 1);
  })

  const details = grades.map((grade, idx) => {
    return <p key={idx}>Test {idx + 1}: {grade}%</p>
  })

  // handle submit of new tag
  const handleSubmit = (newTag) => {
    if (newTag === '' || newTag.length === 0) return;
    const tagArr = [...cardTags];
    tagArr.push(newTag);
    props.addTag(tagArr, props.student.id);
    setCardTags(tagArr);
  }

  return (
    <div>
      <img src={pic} alt={firstName + ' ' + lastName + 'avatar'} />
      <div><span>
        {firstName + ' ' + lastName}
        <button onClick={() => showHideView()}>{viewDetails ? '-' : '+'}</button>
      </span></div>
      <p>Email: {email}</p>
      <p>Company: {company}</p>
      <p>Skill: {skill}</p>
      <p>Average: {avg}</p>
      {viewDetails &&
        <div>
          {details}
        </div>
      }
      {cardTags.map((tag, idx) => {
        return (
          <div key={idx}>{tag}</div>
        )
      })}
      <TagInput key={props.student.id} handleSubmit={handleSubmit} />
    </div>

  )
}

export default StudentCard;