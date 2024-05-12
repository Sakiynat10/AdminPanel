import { Col, Flex, Progress, Row, Statistic } from "antd";
import { Fragment, useEffect, useState } from "react";
import CountUp from "react-countup";
import request from "../../../server/request";
import { PiCurrencyCircleDollarBold } from "react-icons/pi";
import { FaMoneyCheckDollar } from "react-icons/fa6";

import "./dashboard.scss";
const formatter = (value) => <CountUp end={value} separator="," />;

const DashBoardPage = () => {
  const [total, setTotal] = useState(0);
  const [studentTotal, setStudentTotal] = useState(0);
  const [totalMarried, setTotalMarried] = useState(0);
  const [studentTotalMarried, setStudentTotalMarried] = useState(0);
  const [ratingThirty, setRatingThirty] = useState(0);
  const [ratingFifty, setRatingFifty] = useState(0);
  const [ratingSeventy, setRatingSeventy] = useState(0);
  const [salary, setSalary] = useState();
  const [fee, setFee] = useState();

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [callback, setCallBack] = useState(false);
  const [ageThirty, setAgeThirty] = useState(0);
  const [ageFifty, setAgeFifty] = useState(0);
  const [ageSeventy, setAgeSeventy] = useState(0);

  useEffect(() => {
    const getTeachers = async () => {
      try {
        setLoading(true);
        const { data: totalData } = await request("teacher");
        const { data: totalStudentData } = await request("student");
        // console.log( totalData?.map((data) => data.salary));
        let res1 = totalData?.map((data) => data.salary);
        let res2 = totalStudentData?.map((data) => data.fee);

        const getSalary = () => {
          let sumSalary = 0;
          for (const el of res1) {
            // // console.log(+el);
            sumSalary += +el;
            // setSalary(sumSalary);
            // console.log(salary);
          }
          return sumSalary;
        };

        setSalary(getSalary() * 1000);

        const getFee = () => {
          let sumFee = 0;
          for (const el of res2) {
            // // console.log(+el);
            sumFee += +el;
            // setSalary(sumSalary);
            console.log(sumFee);
          }
          return sumFee;
        };

        setFee(getFee() * 1000);

        setAgeSeventy(
          totalData.filter((data) => 65 < data.age && data.age <= 100).length
        );
        setAgeFifty(
          totalData.filter((data) => 30 < data.age && data.age <= 65).length
        );
        setAgeThirty(totalData.filter((data) => data.age <= 30).length);
        setRatingSeventy(
          totalStudentData.filter(
            (data) => 65 < data.rating && data.rating <= 100
          ).length
        );
        setRatingFifty(
          totalStudentData.filter(
            (data) => 30 < data.rating && data.rating <= 65
          ).length
        );
        setRatingThirty(
          totalStudentData.filter((data) => data.rating <= 30).length
        );
        setTotalMarried(
          totalData.filter((data) => data.isMarried === true).length
        );
        setStudentTotalMarried(
          totalStudentData.filter((data) => data.isMarried === true).length
        );
        setTotal(totalData.length);
        setStudentTotal(totalStudentData.length);
      } finally {
        setLoading(false);
      }
    };
    getTeachers();
  }, [page, callback]);

  return (
    <Fragment>
      <div className="dashboard">
        <div className="infos">
          <div className="info-tables">
            <Col className="info-left">
              <Statistic
                className="statistics"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                  justifyContent: "center",
                  width: "62%",
                }}
                title="Active Teachers:"
                value={total}
                formatter={formatter}
              />
              <Flex
                className="marry-info"
                justify="center"
                style={{
                  width: "60%",
                  marginTop: "20px",
                  marginBottom: "20px",
                }}
                gap="small"
                wrap="wrap"
              >
                <Progress
                  type="circle"
                  status="success"
                  percent={Math.ceil((totalMarried / total) * 100)}
                  format={(percent) => `${percent} % Married`}
                />
                <Progress
                  type="circle"
                  className="single-text"
                  percent={100 - Math.ceil((totalMarried / total) * 100)}
                  format={(percent) => `${percent} % Single`}
                />
              </Flex>
              <Flex
                className="age-info"
                style={{ width: "30%", marginLeft: "20%" }}
                gap="small"
                vertical
              >
                <Progress
                  percent={Math.ceil((ageThirty / total) * 100)}
                  format={(percent) => `${percent} % =>  Under 30 years old`}
                  status="success"
                />
                <Progress
                  percent={Math.ceil((ageFifty / total) * 100)}
                  status="active"
                  format={(percent) =>
                    `${percent} %    =>  between the ages of 30 and 65`
                  }
                />
                <Progress
                  percent={Math.ceil((ageSeventy / total) * 100)}
                  status="exception"
                  format={(percent) =>
                    `${percent} %    =>  between the ages of 65 and 100`
                  }
                />
              </Flex>
            </Col>
            <div className="card-salary">
              <span className="money-card">
                <PiCurrencyCircleDollarBold color="white" />
              </span>
              <span className="salary-title">Average Annual Salary</span>
              <Statistic
                className="statistics"
                style={{
                  display: "flex",
                  // alignItems: "center",
                  // gap: "20px",
                  // justifyContent: "center",
                  // width: "62%",
                }}
                value={salary / total}
                formatter={formatter}
                title={
                  <PiCurrencyCircleDollarBold
                    color="yellow"
                    style={{ marginTop: "15px" }}
                  />
                }
              />
            </div>
          </div>
          <div className="info-tables">
            <Col className="info-right">
              <Statistic
                className="statistics"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                  justifyContent: "center",
                  width: "62%",
                }}
                title="Active Students :"
                value={studentTotal}
                precision={2}
                formatter={formatter}
              />
              <Flex
                className="marry-info"
                justify="center"
                style={{
                  width: "60%",
                  marginTop: "20px",
                  marginBottom: "20px",
                }}
                gap="small"
                wrap="wrap"
              >
                <Progress
                  type="circle"
                  status="success"
                  percent={Math.ceil(
                    (studentTotalMarried / studentTotal) * 100
                  )}
                  format={(percent) => `${percent} % Work`}
                />
                <Progress
                  type="circle"
                  status="active"
                  className="single-text"
                  percent={
                    100 - Math.ceil((studentTotalMarried / studentTotal) * 100)
                  }
                  format={(percent) => `${percent} % Jobless`}
                />
              </Flex>
              <Flex
                className="age-info"
                style={{ width: "30%", marginLeft: "20%" }}
                gap="small"
                vertical
              >
                <Progress
                  percent={Math.ceil((ratingThirty / studentTotal) * 100)}
                  format={(percent) => `${percent} % =>  Under 30 rate`}
                  status="success"
                />
                <Progress
                  percent={Math.ceil((ratingFifty / studentTotal) * 100)}
                  status="active"
                  format={(percent) =>
                    `${percent} %    =>  between the ratings of 30 and 65`
                  }
                />
                <Progress
                  percent={Math.ceil((ratingSeventy / studentTotal) * 100)}
                  status="exception"
                  format={(percent) =>
                    `${percent} %    =>  between the ratings of 65 and 100`
                  }
                />
              </Flex>
            </Col>
            <div className="card-salary">
              <span className="money-card-fee">
                <FaMoneyCheckDollar color="white" />
              </span>
              <span className="salary-title">Average Annual Tuition Fee</span>
              <Statistic
                className="statistics"
                style={{
                  display: "flex",
                  // alignItems: "center",
                  // gap: "20px",
                  // justifyContent: "center",
                  // width: "62%",
                }}
                value={fee / total / 4}
                formatter={formatter}
                title={
                  <PiCurrencyCircleDollarBold
                    color="yellow"
                    style={{ marginTop: "15px" }}
                  />
                }
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default DashBoardPage;
