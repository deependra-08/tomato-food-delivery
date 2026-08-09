import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./MyOrders.css";
import { StoreContext } from '../../context/StoreContext';
import { assets } from '../../assets/assets';

const MyOrders = () => {
    const {url, token} = useContext(StoreContext);
    const [data, setData] = useState([]);
    const navigate = useNavigate();

    const fetchOrders = async () => {
        const response = await axios.post(url+"/api/order/userOrders", {}, { headers: { token } });
        setData(response.data.data);
        console.log(response.data.data);
    }

    useEffect(()=>{
        if(token){
            fetchOrders();
        }
    },[token, url])

  return (
    <div className='my-orders'>
        <h2>My Orders</h2>
        <div className="container">
            {data.map((order,index)=>{
                return (
                    <div key={index} className="my-orders-order">
                        <img src={assets.parcel_icon} alt="" />
                        <p>{order.items.map((item,index)=>{
                            if(index == order.items.length-1){
                                return item.name+" x "+item.quantity
                            }

                            else{
                                return item.name+" x "+item.quantity+", "
                            }
                        })}</p>
                        <p>${order.amount}.00</p>
                        <p>Items: {order.items.length}</p>
                        <p><span>&#x25cf;</span><b>{order.status}</b></p>
                        <button onClick={() => navigate(`/track/${order._id}`)}>Track Order</button>
                    </div>
                )
            })}
        </div>

    </div>
  )
}

export default MyOrders