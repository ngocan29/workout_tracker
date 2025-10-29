import { API_CONFIG } from '../constants/api';

const BASE_URL = API_CONFIG.BASE_URL;

// Create a new goal
export const createGoal = async (goalData) => {
  try {
    const response = await fetch(`${BASE_URL}${API_CONFIG.ENDPOINTS.GOAL_CREATE}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(goalData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating goal:', error);
    throw error;
  }
};

// Get goals by user ID
export const getGoalsByUser = async (userID) => {
  try {
    const response = await fetch(`${BASE_URL}${API_CONFIG.ENDPOINTS.GOALS}?userID=${userID}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching goals:', error);
    throw error;
  }
};

// Update goal progress
export const updateGoal = async (goalId, updateData) => {
  try {
    const response = await fetch(`${BASE_URL}${API_CONFIG.ENDPOINTS.GOAL_UPDATE}/${goalId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating goal:', error);
    throw error;
  }
};

// Get total workout time for user (sum of sophuttap from all workouts)
export const getTotalWorkoutTime = async (userID) => {
  try {
    const response = await fetch(`${BASE_URL}${API_CONFIG.ENDPOINTS.WORKOUTS}?userID=${userID}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const workouts = await response.json();
    
    // Calculate total workout time from all workouts for this user
    const totalTime = workouts.reduce((total, workout) => {
      return total + (workout.sophuttap || 0);
    }, 0);
    
    return totalTime;
  } catch (error) {
    console.error('Error fetching total workout time:', error);
    throw error;
  }
};

// Get today's goal for user
export const getTodayGoal = async (userID) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    
    const response = await fetch(`${BASE_URL}${API_CONFIG.ENDPOINTS.GOALS}?userID=${userID}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const goals = await response.json();
    
    // Find today's goal
    const todayGoal = goals.find(goal => {
      const goalDate = new Date(goal.ngaytao);
      return goalDate >= startOfDay && goalDate < endOfDay;
    });
    
    return todayGoal;
  } catch (error) {
    console.error('Error fetching today goal:', error);
    throw error;
  }
};