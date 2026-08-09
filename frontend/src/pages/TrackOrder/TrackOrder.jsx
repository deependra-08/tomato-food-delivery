import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';
import './TrackOrder.css';

const TrackOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { url } = useContext(StoreContext);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderStatus, setOrderStatus] = useState('Food Processing');
  const [progress, setProgress] = useState(25); // percentage 0 - 100
  const [eta, setEta] = useState(20); // minutes
  const [tipAmount, setTipAmount] = useState(null);
  const [showCallModal, setShowCallModal] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'driver', text: "Hello! I have picked up your food from the restaurant. On my way!" }
  ]);

  // Fetch order details from backend & poll for live status updates
  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get(`${url}/api/order/track/${orderId}`);
      if (response.data.success && response.data.data) {
        const fetchedOrder = response.data.data;
        setOrder(fetchedOrder);
        const currentStatus = fetchedOrder.status || 'Food Processing';
        setOrderStatus(currentStatus);

        // Normalize status check
        const normalized = currentStatus.trim().toLowerCase();
        if (normalized === 'delivered') {
          setProgress(100);
          setEta(0);
        } else if (normalized === 'out for delivery') {
          // If out for delivery, set progress to active range (50% - 90%)
          setProgress((prev) => (prev < 50 ? 55 : prev));
        } else {
          // Food Processing or Order Placed
          setProgress(25);
          setEta(20);
        }
      }
    } catch (err) {
      console.error("Error fetching tracking order:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
    // Poll backend every 3 seconds to get live admin status changes
    const pollInterval = setInterval(() => {
      fetchOrderDetails();
    }, 3000);

    return () => clearInterval(pollInterval);
  }, [orderId, url]);

  // Smooth progress animation when Out For Delivery
  useEffect(() => {
    const normalized = orderStatus.trim().toLowerCase();
    if (normalized !== 'out for delivery') return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return 95;
        return prev + 1;
      });
      setEta((prev) => (prev > 2 ? prev - 1 : 2));
    }, 4000);

    return () => clearInterval(interval);
  }, [orderStatus]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    setMessages((prev) => [...prev, { sender: 'user', text: chatMessage }]);
    setChatMessage('');
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: 'driver', text: "Got it! Thanks for letting me know." }
      ]);
    }, 1200);
  };

  if (loading) {
    return (
      <div className="track-loading">
        <div className="spinner"></div>
        <p>Fetching order tracking status...</p>
      </div>
    );
  }

  const subtotal = order?.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
  const deliveryFee = order?.amount ? Math.max(0, order.amount - subtotal) : 2;

  const normalizedStatus = orderStatus.trim().toLowerCase();
  const isDelivered = normalizedStatus === 'delivered';
  const isOutForDelivery = normalizedStatus === 'out for delivery';
  const isProcessing = !isDelivered && !isOutForDelivery;

  return (
    <div className="track-container">
      {/* Header Banner */}
      <div className="track-header">
        <div className="track-title-box">
          <button className="back-btn" onClick={() => navigate('/myorders')}>
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <div>
            <h2>Order Tracking</h2>
            <p className="order-id">Order ID: #{orderId}</p>
          </div>
        </div>

        <div className={`eta-badge ${isDelivered ? 'delivered-badge' : ''}`}>
          <i className="fa-solid fa-clock"></i>
          <div>
            <span className="eta-val">{isDelivered ? 'Arrived!' : isProcessing ? '20 mins' : `${eta} mins`}</span>
            <span className="eta-label">{isDelivered ? 'Food Delivered' : 'Estimated Delivery'}</span>
          </div>
        </div>
      </div>

      {/* Progress Stepper */}
      <div className="stepper-card">
        <div className={`step-item active`}>
          <div className="step-icon"><i className="fa-solid fa-check"></i></div>
          <span>Order Placed</span>
        </div>
        <div className={`step-line ${isProcessing || isOutForDelivery || isDelivered ? 'active' : ''}`}></div>
        <div className={`step-item ${isProcessing || isOutForDelivery || isDelivered ? 'active' : ''}`}>
          <div className="step-icon"><i className="fa-solid fa-utensils"></i></div>
          <span>Kitchen Preparing</span>
        </div>
        <div className={`step-line ${isOutForDelivery || isDelivered ? 'active' : ''}`}></div>
        <div className={`step-item ${isOutForDelivery || isDelivered ? 'active' : ''}`}>
          <div className="step-icon"><i className="fa-solid fa-motorcycle"></i></div>
          <span>Out for Delivery</span>
        </div>
        <div className={`step-line ${isDelivered ? 'active' : ''}`}></div>
        <div className={`step-item ${isDelivered ? 'active' : ''}`}>
          <div className="step-icon"><i className="fa-solid fa-house-chimney-user"></i></div>
          <span>Delivered</span>
        </div>
      </div>

      {/* Admin Control Notification when Order is still in Kitchen */}
      {isProcessing ? (
        <div className="preparing-notice-card">
          <div className="notice-icon-box">
            <i className="fa-solid fa-fire-burner notice-anim-icon"></i>
          </div>
          <div className="notice-content">
            <h3>Your Order is Being Prepared in the Kitchen 🍳</h3>
            <p>The restaurant is currently cooking your meal. Full live delivery tracking will activate automatically once the admin updates your order status to <strong>"Out For Delivery"</strong>.</p>
            <div className="status-pill-badge">
              <span className="dot-pulse"></span>
              Current Status: <strong>{orderStatus}</strong> (Waiting for Dispatch)
            </div>
          </div>
        </div>
      ) : (
        /* Full Tracking Grid - Active when Admin marks Out For Delivery or Delivered */
        <div className="track-content-grid-no-map">
          {/* Main Status Panel */}
          <div className="status-main-panel">
            <div className="live-status-card">
              <div className="status-header-banner">
                <i className={`fa-solid ${isDelivered ? 'fa-circle-check' : 'fa-motorcycle'} status-hero-icon ${isDelivered ? 'delivered' : ''}`}></i>
                <div>
                  <h3>{isDelivered ? 'Your Food Has Arrived!' : 'Delivery Partner On The Way'}</h3>
                  <p>{isDelivered ? 'Enjoy your delicious meal!' : 'Rahul Sharma is delivering your meal directly to your address.'}</p>
                </div>
              </div>

              <div className="status-progress-bar-box">
                <div className="progress-label-row">
                  <span>Delivery Progress</span>
                  <span>{progress}%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                </div>
              </div>

              <div className="address-delivery-box">
                <div className="addr-icon"><i className="fa-solid fa-location-dot"></i></div>
                <div>
                  <span className="addr-title">Delivery Destination</span>
                  <p className="addr-text">
                    {order?.address?.street 
                      ? `${order.address.firstName || ''} ${order.address.lastName || ''}, ${order.address.street}, ${order.address.city}, ${order.address.zipcode}`
                      : 'Customer Home Address'}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Chat */}
            <div className="chat-card">
              <div className="chat-header">
                <i className="fa-solid fa-comments"></i> Chat with Delivery Partner
              </div>
              <div className="chat-messages">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`chat-bubble ${msg.sender}`}>
                    {msg.text}
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendMessage} className="chat-input-form">
                <input 
                  type="text" 
                  placeholder="Leave delivery instructions..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                />
                <button type="submit"><i className="fa-solid fa-paper-plane"></i></button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="track-sidebar">
            {/* Driver Card */}
            <div className="driver-card">
              <div className="driver-header">
                <img 
                  src={order?.driverDetails?.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"} 
                  alt="Driver" 
                  className="driver-img"
                />
                <div className="driver-meta">
                  <h3>{order?.driverDetails?.name || "Rahul Sharma"}</h3>
                  <p className="vehicle"><i className="fa-solid fa-motorcycle"></i> {order?.driverDetails?.vehicleNo || "MH 02 AB 1234"}</p>
                  <span className="rating"><i className="fa-solid fa-star"></i> {order?.driverDetails?.rating || "4.9"} (1,420 orders)</span>
                </div>
              </div>

              <div className="driver-actions">
                <button className="call-btn" onClick={() => setShowCallModal(true)}>
                  <i className="fa-solid fa-phone"></i> Call Driver
                </button>
                <div className="tip-box">
                  <span className="tip-title">Add Tip for Driver:</span>
                  <div className="tip-options">
                    {[2, 3, 5].map((amt) => (
                      <button 
                        key={amt} 
                        className={`tip-btn ${tipAmount === amt ? 'active' : ''}`}
                        onClick={() => setTipAmount(amt)}
                      >
                        ${amt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary Card */}
            <div className="order-summary-card">
              <h4>Order Summary</h4>
              <div className="summary-items">
                {order?.items?.map((item, idx) => (
                  <div key={idx} className="summary-row">
                    <span>{item.quantity}x {item.name}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="summary-breakdown" style={{ padding: '8px 0', borderBottom: '1px dashed #cbd5e1', marginBottom: '12px' }}>
                <div className="summary-row" style={{ color: '#64748b', fontSize: '13px', display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-row" style={{ color: '#64748b', fontSize: '13px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Delivery Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
              </div>

              <div className="summary-total">
                <span>Total Amount</span>
                <strong>${(order?.amount || 0).toFixed(2)}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Call Driver Modal */}
      {showCallModal && (
        <div className="modal-backdrop" onClick={() => setShowCallModal(false)}>
          <div className="call-modal" onClick={(e) => e.stopPropagation()}>
            <i className="fa-solid fa-phone-volume call-icon-anim"></i>
            <h3>Calling Delivery Partner</h3>
            <p>Rahul Sharma (+91 98765 43210)</p>
            <p className="call-note">Connecting via masked secure call...</p>
            <button className="end-call-btn" onClick={() => setShowCallModal(false)}>
              End Call
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackOrder;
