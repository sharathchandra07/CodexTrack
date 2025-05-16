import { useState } from 'react';
import { Award, Trophy, Brain } from 'lucide-react';
import axios from 'axios';
import './componets/styles.css';

function App() {
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [userId, setUserId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  const platforms = [
    { id: 'Leetcode', name: 'LeetCode', icon: <Brain size={54} />, color: "rgba(0, 204, 255, 0.8)" },
    { id: 'Codechef', name: 'CodeChef', icon: <Award size={54} />, color: '#8b5cf6' },
    { id: 'CodeForces', name: 'CodeForces', icon: <Trophy size={54} />, color: '#ec4899' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedPlatform && userId) {
      setIsSubmitting(true);
      setErrorMessage('');
      setResult({});

      try {
        const response = await axios.post('https://codex-track.vercel.app/api/data', {
          message: userId,
          id: selectedPlatform,
        });

        // console.log('API Response:', response.data);

        if (!response.data || Object.keys(response.data).length === 0) {
          setErrorMessage("User doesn't exist");
          return;
        }

        let tempResult = {};

        if (selectedPlatform === 'Leetcode' && response.data.ranking) {
          tempResult = {
            'Acceptance Rate': response.data.acceptanceRate,
            'Total Solved': response.data.totalSolved,
            'Rank': response.data.ranking,
            'Easy Solved': response.data.easySolved,
            'Medium Solved': response.data.mediumSolved,
            'Hard Solved': response.data.hardSolved,
          };
        } else if (selectedPlatform === 'Codechef' && response.data.name) {
          tempResult = {
            'Name': response.data.name,
            'Current Rating': response.data.currentRating,
            'Highest Rating': response.data.highestRating,
            'Stars': response.data.stars,
            'Country Rank': response.data.countryRank,
            'Global Rank': response.data.globalRank,
          };
        } else if (selectedPlatform === 'CodeForces' && response.data.result?.length > 0) {
          tempResult = {
            'Name': response.data.result[0].handle,
            'Contribution': response.data.result[0].contribution,
            'Friends': response.data.result[0].friendOfCount,
            'Rating': response.data.result[0].rating,
            'Rank': response.data.result[0].rank,
            'Max Rating': response.data.result[0].maxRating,
          };
        } else if (selectedPlatform === 'GeeksforGeeks') {
          tempResult = response.data;
        } else if (selectedPlatform === 'hackerearth') {
          tempResult = response.data;
        } else if (selectedPlatform === 'interviewbit') {
          tempResult = response.data;
        }

        if (Object.keys(tempResult).length > 0) {
          setResult(tempResult);
        } else {
          setErrorMessage("User doesn't exist");
        }
      } catch (error) {
        setErrorMessage("User doesn't exist");
        // console.error(error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="main-container">
      <div className="container">
        <h1 className="app-title text-center">
          Competitive Coding Tracker
        </h1>
        
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="card">
              <div className="card-body p-4 p-md-4">
                <h2 className="section-title">Track your coding progress</h2>
                
                <form onSubmit={handleSubmit}>
                  <div className="row g-4 mb-4">
                    {platforms.map((platform) => (
                      <div key={platform.id} className="col-md-4">
                          <div 
                            className="platform-logo"
                            style={{ color: platform.color, height: "130px", width: "130px" }}
                          >
                            {platform.icon}
                          {/* <div className="platform-name">{platform.name}</div> */}
                          </div>
                      </div>
                    ))}
                  </div>
                  <div className="w-100">
                    {/* <label for="platform" class="form-label">Choose a Coding Platform</label> */}
                    <select className="form-select form-control mt-2 from-label form-select-lg shadow text-white" onChange={(e) => setSelectedPlatform(e.target.value)} style={{backgroundColor: "rgba(41,48,68)", borderRadius: "9px"}} name="platform" id="platform">
                      <option defaultValue="">Select your platform</option>
                      <option value="Leetcode">Leetcode</option>
                      <option value="GeeksforGeeks">GeeksforGeeks</option>
                      <option value="Codechef">CodeChef</option>
                      <option value="CodeForces">CodeForces</option>
                      <option value="interviewbit">InterviewBit</option>
                      {/* <option value="hackerrank">HackerRank</option> */}
                      <option value="hackerearth">HackerEarth</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="userId" className="form-label w-100">
                      <input
                        type="text"
                        className="form-control mt-2 text-white"
                        id="userId"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        placeholder="Enter your username"
                        required
                      />
                    </label>
                  </div>

                  <button 
                    type="submit"
                    className="btn btn-success w-100"
                    disabled={!selectedPlatform || !userId || isSubmitting || selectedPlatform === 'Select your platform'}
                  >
                    {isSubmitting ? 'Processing...' : 'Track Progress'}
                  </button>
                </form>

                {errorMessage && (
                  <div className="alert alert-danger mt-4" role="alert">
                    {errorMessage}
                  </div>
                )}

                {Object.keys(result).length > 0 && (
                  <div className="mt-4">
                    <h3 className="section-title mb-3">User Statistics</h3>
                    <div className="stats-grid">
                      {Object.entries(result).map(([key, value], index) => (
                        <div key={index} className="stat-item">
                          <div className="stat-label">{key}</div>
                          <div className="stat-value">{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;