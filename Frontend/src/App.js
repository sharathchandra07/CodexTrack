import React, { useState } from 'react';
import { Code2, Award, Trophy } from 'lucide-react';
import axios from 'axios';
import './componets/styles.css';
function App() {
  const [selectedPlatform, setSelectedPlatform] = useState('Leetcode');
  const [userId, setUserId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  const platforms = [
    { id: 'Leetcode', name: 'LeetCode', icon: <Code2 size={24} />, color: '#6366f1' },
    { id: 'Codechef', name: 'CodeChef', icon: <Award size={24} />, color: '#8b5cf6' },
    { id: 'CodeForces', name: 'CodeForces', icon: <Trophy size={24} />, color: '#ec4899' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedPlatform && userId) {
      setIsSubmitting(true);
      setErrorMessage('');
      setResult({});

      try {
        const response = await axios.post('http://localhost:5000/api/data', {
          message: userId,
          id: selectedPlatform,
        });

        console.log('API Response:', response.data);

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
        }

        if (Object.keys(tempResult).length > 0) {
          setResult(tempResult);
        } else {
          setErrorMessage("User doesn't exist");
        }
      } catch (error) {
        setErrorMessage('Error fetching data. Please try again.');
        console.error('Error:', error);
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
              <div className="card-body p-4 p-md-5">
                <h2 className="section-title">Select Your Platform</h2>
                
                <form onSubmit={handleSubmit}>
                  <div className="row g-4 mb-4">
                    {platforms.map((platform) => (
                      <div key={platform.id} className="col-md-4">
                        <div 
                          className={`platform-card p-3 text-center ${selectedPlatform === platform.id ? 'selected' : ''}`}
                          onClick={() => setSelectedPlatform(platform.id)}
                        >
                          <div 
                            className="platform-logo"
                            style={{ color: platform.color }}
                          >
                            {platform.icon}
                          </div>
                          <div className="platform-name">{platform.name}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="userId" className="form-label w-100">
                      Username
                      <input
                        type="text"
                        className="form-control mt-2"
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
                    disabled={!selectedPlatform || !userId || isSubmitting}
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