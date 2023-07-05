import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LogReportPage2 = () => {
  const [inputs, setInputs] = useState({
    search_type: '',
    search_date: '',
    lic_name: '',
  });
  const [err, setError] = useState(null);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('inputs==>', inputs);

      const url = `/logs/loginuser?search_type=${inputs.search_type}&search_date=${inputs.search_date}&lic_name=${inputs.lic_name}`;
      const res = await axios.get(url, inputs);

      console.log(res.data);
    } catch (err) {
      setError(err.response.data);
    }
  };
  return (
    <div className="auth">
      <form>
        <input required type="text" placeholder="검색 구분" name="search_type" onChange={handleChange} />
        <br />
        <input required type="text" placeholder="검색 날짜" name="search_date" onChange={handleChange} />
        <br />
        <input required type="text" placeholder="lic_name" name="lic_name" onChange={handleChange} />
        <br />
        <button onClick={handleSubmit}>submit</button>
        {err && <p>{err}</p>}
      </form>
    </div>
  );
};

export default LogReportPage2;
