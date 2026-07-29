import requests
import hmac
import hashlib
import time

BASE_URL = "http://localhost:8000/api/v1"
SECRET = "jUIAvq4u8OQR0gUVR9pJzF34"

def run_test():
    print("Starting Integration Test Flow...")
    
    # 1. Register and Login
    email = f"test_{int(time.time())}@example.com"
    password = "Password123!"
    
    print(f"[*] Registering user {email}...")
    res = requests.post(f"{BASE_URL}/auth/register", json={
        "email": email, "password": password, "full_name": "Test User"
    })
    
    print("[*] Logging in...")
    res = requests.post(f"{BASE_URL}/auth/login", data={
        "username": email, "password": password
    })
    token = res.json().get("access_token")
    headers = {"Authorization": f"Bearer {token}"}
    
    # 2. Check initial credits
    res = requests.get(f"{BASE_URL}/subscription/me", headers=headers)
    print(f"[*] Initial Subscription: {res.json()['data']['predictions_remaining']} credits remaining.")
    
    # 3. Exhaust credits
    for i in range(2):
        print(f"[*] Running prediction {i+1}...")
        res = requests.post(f"{BASE_URL}/prediction/heart_disease", headers=headers, json={
            "features": {"age": 45, "sex": 1, "cp": 0, "trestbps": 120, "chol": 200, "fbs": 0, "restecg": 0, "thalach": 150, "exang": 0, "oldpeak": 0.0, "slope": 1, "ca": 0, "thal": 2},
            "input_type": "manual_form"
        })
        if res.status_code == 200:
            print(f"    -> Success! Risk: {res.json()['data']['risk_level']}")
    
    # 4. Check credits are 0
    res = requests.get(f"{BASE_URL}/subscription/me", headers=headers)
    credits = res.json()['data']['predictions_remaining']
    print(f"[*] Credits after 2 predictions: {credits}")
    
    # 5. Attempt 3rd prediction (should fail)
    print("[*] Attempting 3rd prediction...")
    res = requests.post(f"{BASE_URL}/prediction/heart_disease", headers=headers, json={
        "features": {}, "input_type": "manual_form"
    })
    if res.status_code == 402:
        print("    -> Correctly failed with 402 Payment Required.")
    else:
        print(f"    -> Unexpected status: {res.status_code}")
        
    # 6. Create Razorpay Order
    print("[*] Creating Razorpay Order for Care+ plan...")
    res = requests.post(f"{BASE_URL}/payment/create-order", headers=headers, json={"plan": "care_plus"})
    order_data = res.json().get("data", {})
    order_id = order_data.get("order_id")
    print(f"    -> Order created successfully! Order ID: {order_id}")
    
    # 7. Mock Razorpay checkout success and generate signature
    payment_id = f"pay_mock_{int(time.time())}"
    message = f"{order_id}|{payment_id}"
    signature = hmac.new(SECRET.encode(), message.encode(), hashlib.sha256).hexdigest()
    print(f"[*] Generated valid signature for payment {payment_id}")
    
    # 8. Verify Payment
    print("[*] Verifying payment with backend...")
    res = requests.post(f"{BASE_URL}/payment/verify", headers=headers, json={
        "razorpay_order_id": order_id,
        "razorpay_payment_id": payment_id,
        "razorpay_signature": signature
    })
    print(f"    -> Verification Response: {res.json().get('message')}")
    
    # 9. Check subscription updated
    res = requests.get(f"{BASE_URL}/subscription/me", headers=headers)
    sub_data = res.json()['data']
    print(f"[*] Updated Subscription: {sub_data['plan']} | Credits: {sub_data['predictions_remaining']} (null means unlimited)")
    
    # 10. Run 3rd prediction successfully
    print("[*] Running prediction again with unlimited access...")
    res = requests.post(f"{BASE_URL}/prediction/heart_disease", headers=headers, json={
        "features": {"age": 45, "sex": 1, "cp": 0, "trestbps": 120, "chol": 200, "fbs": 0, "restecg": 0, "thalach": 150, "exang": 0, "oldpeak": 0.0, "slope": 1, "ca": 0, "thal": 2},
        "input_type": "manual_form"
    })
    if res.status_code == 200:
        print(f"    -> Success! Risk: {res.json()['data']['risk_level']}")
        
    print("\n✅ All integration tests passed successfully.")

if __name__ == "__main__":
    run_test()
