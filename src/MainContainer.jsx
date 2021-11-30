import { useCallback, useEffect, useState } from "react"
import SearchBox from "./SearchBox";
import StudentCard from "./StudentCard";

/* method: GET
url: https://api.hatchways.io/assessment/students
*/
const URL = 'https://api.hatchways.io/assessment/students';
const MainContainer = () => {
  // hooks to hold student raw data, all student component array, components to display array
  const [studentRawData, setStudentRawData] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [displayData, setDisplayData] = useState([]);
  const [input, setInput] = useState('');
  const [tagSearch, setTagSearch] = useState('');
  const [studentTags, setStudentTags] = useState({});



  // initial fetching of data, sets studentData state to Array of StudentObjects
  useEffect(() => {
    const fetchData = async () => {
      const { students } = await (await fetch(URL)).json();
      setStudentRawData(students);
    }
    fetchData();
  }, []);

  // generate all student cards whenever tags or data changes.
  useEffect(() => {
    const addTag = (arr, id) => {
      const currentTags = { ...studentTags };
      currentTags[id] = arr;
      setStudentTags(currentTags);
    }
    // helper function to generate student card components (used in filtering and initial retrieval)
    const studentComponents = studentRawData.map((student) => {
      return (
        <StudentCard key={student.id}
          student={student}
          addTag={addTag}
          tags={studentTags[student.id] ? studentTags[student.id] : []}
        />
      )
    })
    setAllStudents(studentComponents);
    setDisplayData(studentComponents);
  }, [studentRawData, studentTags]);


  useEffect(() => {
    // // filters displayed students by query if text is included in any part of the full name
    const searchByName = (text) => {
      const allStudentData = [...studentRawData];
      const foundStudents = allStudentData.filter((student) => {
        const { firstName, lastName } = student
        const fullName = firstName.toUpperCase() + ' ' + lastName.toUpperCase();
        const query = text.toUpperCase();
        console.log(fullName, query, fullName.includes(query));
        return fullName.includes(query);
      });
      const foundIds = [];
      for (const student in foundStudents) {
        foundIds.push(foundStudents[student].id);
      }
      return foundIds;
    }

    // filters displayed student data by tag
    const searchByTag = (text) => {
      const allTags = { ...studentTags };
      //student = {id: [tags]}
      const foundIds = [];
      for (const student in allTags) {
        if (allTags[student].join('').includes(text)) {
          foundIds.push(student);
        }
      } // foundIds is array of matching student IDs
      return foundIds;
    }

    //helper function to search by both text inputs 
    const searchByBoth = () => {
      if (input.length === 0 && tagSearch.length === 0) {
        setDisplayData(allStudents);
        return;
      } else {
        const filterByName = (input.length > 0) ? searchByName(input) : [];
        const filterByTag = (tagSearch.length > 0) ? searchByTag(tagSearch) : [];
        let combinedIds = [];
        if (filterByName.length === 0) {
          combinedIds = filterByTag;
        } else if (filterByTag.length === 0) {
          combinedIds = filterByName;
        } else if (filterByTag.length === 0 && filterByName.length === 0) {
          setDisplayData(allStudents);
          return;
        } else {
          combinedIds = filterByName.filter((id) => {
            return filterByTag.includes(id);
          })
        }
        const finalFilter = allStudents.filter((student) => {
          return combinedIds.indexOf(student.key) > -1;
        })
        setDisplayData(finalFilter);
      }
    }
    searchByBoth();
  }, [input, tagSearch, allStudents, studentRawData, studentTags]);

  // name input onChange handler. Passed down as prop to name search Box
  const nameSearchHandler = (text) => {
    setInput(text);
  }

  // tag search input onChange handler. Passed down as prop to tag search Box
  const tagSearchHandler = (text) => {
    setTagSearch(text);
  }

  return (
    <>
      <SearchBox input={input} searchType='name' onChangeHandler={nameSearchHandler} />
      <SearchBox input={tagSearch} searchType='tag' onChangeHandler={tagSearchHandler} />
      <div>
        {displayData}
      </div>
    </>
  )
}

export default MainContainer