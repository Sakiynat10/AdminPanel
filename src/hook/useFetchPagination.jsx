import { useEffect, useState } from "react";
import request from "../server/request";
import { useForm } from "antd/es/form/Form";
import { useNavigate } from "react-router-dom";

const useFetchPagination = ({url}) => {
    const [data, setData] = useState(null);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [callback, setCallBack] = useState(false);
    const navigate = useNavigate();
    const [filter , setFilter] = useState('');

    const [form] = useForm();


    useEffect(() => {
        const getData = async () => {
          try {
            setLoading(true);
            const params = { page, limit: 10};
            const {data} = await request(url , { params });
            // const {data} = await request(search ? `teacher?search=${search}` : "teacher", { params });
            const { data: totalData } = await request(url);
            setTotal(totalData.length);
            setData(data);
          } finally {
            setLoading(false);
          }
        };
        getData();
      }, [page, callback , url ]);

      const refetch = () => {
        setCallBack(!callback);
      };
    
      const handlePage = (page) => {
        setPage(page);
      };
    
    
      const handleCancel = () => {
        setIsModalOpen(false);
      };
    
  return {loading , handleCancel ,  handlePage ,  data , total , setIsModalOpen ,refetch, isModalOpen ,btnLoading , setBtnLoading }
}

export default useFetchPagination