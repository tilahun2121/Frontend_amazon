import React, { useState, useContext } from "react";
import { Link, useNavigate,useLocation} from "react-router-dom";
import "./Auth.css"; 
import logo from "../../../assets/images/logo.png";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../../Utility/firebase/firebase"; 
import { DataContext } from "../../DataProvider/DataProvider";
import { type } from "../../Utility/action.type"; 

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
   const [{ user }, dispatch] = useContext(DataContext);
  const navigate = useNavigate();
  const navStateData=useLocation();
  console.log(navStateData);
 

  // Clear error after 5 seconds
  const clearErrorAfterDelay = () => {
    setTimeout(() => {
      setError("");
    }, 5000);
  };

  // Sign In Handler
  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    if (!email) {
      setError("Please enter your email address");
      setLoading(false);
      return;
    }
    if (!password) {
      setError("Please enter your password");
      setLoading(false);
      return;
    }
    
    try {
      const userinfo = await signInWithEmailAndPassword(auth, email, password);
      console.log("Signed in:", userinfo.user);
      dispatch({
        type: type.SET_USER,  // ✅ Using your imported type
        user: userinfo.user
      });
      setLoading(false);
      navigate(navStateData?.state?.redirect ||"/");
    } catch (err) {
      setLoading(false);
      switch (err.code) {
        case 'auth/user-not-found':
          setError("No account found with this email. Please create an account.");
          break;
        case 'auth/wrong-password':
          setError("Incorrect password. Please try again.");
          break;
        case 'auth/invalid-email':
          setError("Invalid email format. Please enter a valid email address.");
          break;
        case 'auth/too-many-requests':
          setError("Too many failed attempts. Please try again later.");
          break;
        default:
          setError(err.message);
      }
      clearErrorAfterDelay();
    }
  };

  // Sign Up Handler
  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    if (!email) {
      setError("Please enter your email address");
      setLoading(false);
      return;
    }
    if (!password) {
      setError("Please enter your password");
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }
    
    try {
      const userinfo = await createUserWithEmailAndPassword(auth, email, password);
      console.log("Signed up:", userinfo.user);
      dispatch({
        type: type.SET_USER,  // ✅ Using your imported type
        user: userinfo.user
      });
      setLoading(false);
      navigate(navStateData?.state?.redirect ||"/");
    } catch (err) {
      setLoading(false);
      switch (err.code) {
        case 'auth/email-already-in-use':
          setError("This email is already registered. Please sign in instead.");
          break;
        case 'auth/invalid-email':
          setError("Invalid email format. Please enter a valid email address.");
          break;
        case 'auth/weak-password':
          setError("Password is too weak. Please use at least 6 characters.");
          break;
        default:
          setError(err.message);
      }
      clearErrorAfterDelay();
    }
  };

  // Sign Out Handler
  const handleSignOut = async () => {
    setError("");
    setLoading(true);
    
    try {
      await signOut(auth);
      console.log("Signed out successfully");
      dispatch({
        type: type.SET_USER,  // ✅ Using your imported type
        user: null
      });
      setLoading(false);
      setEmail("");
      setPassword("");
    } catch (err) {
      setLoading(false);
      setError("Failed to sign out. Please try again.");
      clearErrorAfterDelay();
    }
  };

  // Toggle between Sign In and Sign Up modes
  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError("");
    setEmail("");
    setPassword("");
  };

  // If user is already logged in, show sign out option
  if (user) {
    return (
      <section className="auth-section">
        <div className="auth-container">
          <div className="auth-logo">
            <img src={logo} alt="Logo" />
          </div>
          
          <div className="auth-card">
            <h1>Welcome Back!</h1>
            <div className="user-info">
              <p>You are signed in as:</p>
              <p className="user-email">{user.email}</p>
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <button 
              type="button" 
              className="signout-btn" 
              onClick={handleSignOut}
              disabled={loading}
            >
              {loading ? "Signing Out..." : "Sign Out"}
            </button>
            
            <Link to="/" className="home-link">
              Continue Shopping
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="auth-section">
      <div className="auth-container">
        <div className="auth-logo">
          <img src={logo} alt="Logo" />
        </div>

        <div className="auth-card">
          <h1>{isSignUp ? "Create Account" : "Sign-In"}</h1>
          {navStateData?.state?.msg&&(
            <small style={{padding:"5px",
              color:"red",
              textAlign:"center",

            }}>
              {navStateData?.state?.msg}
            </small>
          )}
          {/* {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )} */}

          <form className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                id="email"
                placeholder="name@example.com"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                type="password" 
                id="password" 
                placeholder={isSignUp ? "Minimum 6 characters" : " "}
                required 
                disabled={loading}
              />
              {isSignUp && (
                <small className="password-hint">
                  Password must be at least 6 characters long
                </small>
              )}
            </div>

            {!isSignUp && (
              <div className="form-options">
                <label className="checkbox-label">
                  <input type="checkbox" disabled={loading} /> Remember me
                </label>
                <Link to="/forgot-password" className="forgot-link">
                  Forgot password?
                </Link>
              </div>
            )}

            {loading && (
              <div className="loading-overlay">
                <div className="spinner"></div>
                <p>{isSignUp ? "Creating your account..." : "Signing you in..."}</p>
              </div>
            )}

            <button 
              type="button" 
              className="signin-btn" 
              onClick={isSignUp ? handleSignUp : handleSignIn}
              disabled={loading}
            >
              {loading 
                ? (isSignUp ? "Creating Account..." : "Signing In...") 
                : (isSignUp ? "Create Account" : "Sign In")
              }
            </button>
            
            <p>By signing {isSignUp ? "up" : "in"} you agree to Amazon's conditions</p>
            
            <div className="toggle-mode">
              {isSignUp ? (
                <p>
                  Already have an account?{" "}
                  <button type="button" className="toggle-btn" onClick={toggleMode} disabled={loading}>
                    Sign In
                  </button>
                </p>
              ) : (
                <p>
                  New to Amazon?{" "}
                  <button type="button" className="toggle-btn" onClick={toggleMode} disabled={loading}>
                    Create your Amazon account
                  </button>
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Auth;

