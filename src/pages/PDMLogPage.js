import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import PropTypes from 'prop-types';

// sections
import PDMLogChartPage from './PDMLogChartPage';
import PDMLogTablePage from './PDMLogTablePage';

PDMLogPage.propTypes = {
  logType: PropTypes.string,
  logName: PropTypes.string,
};

export default function PDMLogPage({ logType, logName }) {
  const [searchType, setSearchType] = useState(''); // 검색 구분
  const [searchDate, setSearchDate] = useState(''); // 검색 날짜
  const [searchUser, setSearchUser] = useState(''); // 검색 사용자
  const [searchUserName, setSearchUserName] = useState('All'); // 검색 사용자 이름
  const [logDatas, setLogDatas] = useState([]); // server 처리 결과
  const [userList, setUserList] = useState([]); // 사용자 리스트
  const [tableHead, setTableHead] = useState([]); // 테이블 칼럼
  const [searchStartDate, setSearchStartDate] = useState(''); // 검색 시작 날짜
  const [searchEndDate, setSearchEndDate] = useState(''); // 검색 종료 날짜

  return (
    <>
      <Helmet>
        <title>{logName}</title>
      </Helmet>

      {/* {console.log('username', searchUserName, searchDate)} */}
      <PDMLogChartPage
        title={logName}
        subTitle={`${searchType === 'month' ? '월' : '연'}, ${searchDate}, ${searchUserName}`}
        xLabel={`${searchType === 'month' ? '일' : '월'}`}
        chartDatas={logDatas}
        chartLabels={tableHead}
      />
      <br />
      <PDMLogTablePage
        sParam={logType}
        onSearchType={setSearchType}
        onSearchDate={setSearchDate}
        onSearchUser={setSearchUser}
        onSearchUserName={setSearchUserName}
        onLogDatas={setLogDatas}
        onUserList={setUserList}
        onTableHead={setTableHead}
        onSearchStartDate={setSearchStartDate}
        onSearchEndDate={setSearchEndDate}
      />
    </>
  );
}
