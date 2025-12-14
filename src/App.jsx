import React, { useState } from 'react';

const Download = () => <span style={{fontSize: '1.2em'}}>⬇️</span>;
const Loader = () => <span style={{fontSize: '1.2em'}}>⏳</span>;
const ArrowRight = () => <span style={{fontSize: '1.2em'}}>→</span>;
const ArrowLeft = () => <span style={{fontSize: '1.2em'}}>←</span>;

export default function KetoMealPlanner() {
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: '', age: '', weight: '', heightFeet: '', heightInches: '', sex: '', activityLevel: 'moderate',
    dietaryRestrictions: '', dislikedFoods: '', cookingSkill: 'intermediate', timeToCook: '30min',
    mealsPerDay: '3', goal: 'weightLoss', targetWeight: '', timeline: '12weeks', budget: 'moderate'
  });

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const generate = async () => {
    setLoading(true);
    const bmi = (formData.weight / Math.pow((parseInt(formData.heightFeet) * 12 + parseInt(formData.heightInches)), 2)) * 703;
    const prompt = `You are a certified nutritionist and keto diet expert. Create a comprehensive 30-day keto meal plan for ${formData.name}.

PROFILE:
Age: ${formData.age}, Sex: ${formData.sex}
Current: ${formData.weight} lbs, ${formData.heightFeet}'${formData.heightInches}"
BMI: ${bmi.toFixed(1)}
Activity: ${formData.activityLevel}

PREFERENCES:
Dietary Restrictions: ${formData.dietaryRestrictions || 'None'}
Disliked Foods: ${formData.dislikedFoods || 'None'}
Cooking Skill: ${formData.cookingSkill}
Time to Cook: ${formData.timeToCook}
Meals/Day: ${formData.mealsPerDay}
Budget: ${formData.budget}

GOALS:
Primary Goal: ${formData.goal}
Target Weight: ${formData.targetWeight} lbs
Timeline: ${formData.timeline}

Create a detailed keto meal plan with:
1. MACROS - Daily calories, fat, protein, carbs (net carbs <20g)
2. 30-DAY MEAL PLAN - Breakfast, lunch, dinner, snacks for each day
3. SHOPPING LIST - Weekly grocery lists organized by category
4. RECIPES - Easy-to-follow recipes with macros for each meal
5. MEAL PREP GUIDE - How to batch cook and prep for the week
6. KETO BASICS - What to eat, what to avoid, how to stay in ketosis
7. TROUBLESHOOTING - How to handle keto flu, plateaus, cravings
8. DINING OUT GUIDE - Keto options at restaurants
9. PROGRESS TRACKING - How to measure success beyond the scale

Make it realistic for someone with ${formData.cookingSkill} cooking skills and ${formData.timeToCook} available per meal.`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 12000,
          messages: [{role: "user", content: prompt}]
        })
      });
      const data = await response.json();
      setPlan(data.content[0].text);
      setCurrentPage(3);
    } catch (error) {
      alert("Error generating plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    const el = document.createElement("a");
    const file = new Blob([plan], {type: 'text/plain'});
    el.href = URL.createObjectURL(file);
    el.download = `${formData.name}_Keto_Meal_Plan.txt`;
    document.body.appendChild(el);
    el.click();
    document.body.removeChild(el);
  };

  const inputStyle = {width: '100%', padding: '0.75rem', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '1rem'};
  const labelStyle = {display: 'block', fontWeight: '600', marginBottom: '0.5rem'};

  return (
    <div style={{minHeight: '100vh', background: 'linear-gradient(135deg, #10B981 0%, #84CC16 50%, #EAB308 100%)', padding: '2rem'}}>
      <div style={{maxWidth: '900px', margin: '0 auto', background: 'white', borderRadius: '16px', padding: '3rem', boxShadow: '0 20px 60px rgba(0,0,0,0.3)'}}>
        <div style={{textAlign: 'center', marginBottom: '2rem'}}>
          <div style={{width: '80px', height: '80px', background: 'linear-gradient(135deg, #10B981 0%, #84CC16 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '2.5rem'}}>🥗</div>
          <h1 style={{fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem', background: 'linear-gradient(135deg, #10B981 0%, #84CC16 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>Keto Meal Planner</h1>
          <p style={{color: '#6b7280', fontSize: '1.1rem'}}>Your personalized path to keto success</p>
        </div>

        {currentPage === 1 && (
          <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
            <h2 style={{fontSize: '1.8rem', fontWeight: '700'}}>Your Profile</h2>
            <div><label style={labelStyle}>Name *</label><input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="First name" style={inputStyle}/></div>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem'}}>
              <div><label style={labelStyle}>Age</label><input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="30" style={inputStyle}/></div>
              <div><label style={labelStyle}>Weight (lbs)</label><input type="number" name="weight" value={formData.weight} onChange={handleChange} placeholder="180" style={inputStyle}/></div>
              <div><label style={labelStyle}>Sex</label><select name="sex" value={formData.sex} onChange={handleChange} style={inputStyle}><option value="">Select...</option><option value="male">Male</option><option value="female">Female</option></select></div>
            </div>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
              <div><label style={labelStyle}>Height (feet)</label><input type="number" name="heightFeet" value={formData.heightFeet} onChange={handleChange} placeholder="5" style={inputStyle}/></div>
              <div><label style={labelStyle}>Height (inches)</label><input type="number" name="heightInches" value={formData.heightInches} onChange={handleChange} placeholder="10" style={inputStyle}/></div>
            </div>
            <div><label style={labelStyle}>Activity Level</label><select name="activityLevel" value={formData.activityLevel} onChange={handleChange} style={inputStyle}><option value="sedentary">Sedentary</option><option value="light">Lightly Active</option><option value="moderate">Moderately Active</option><option value="very">Very Active</option></select></div>
            <button onClick={() => setCurrentPage(2)} style={{padding: '1rem', background: 'linear-gradient(135deg, #10B981 0%, #84CC16 100%)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'}}>Continue <ArrowRight/></button>
          </div>
        )}

        {currentPage === 2 && (
          <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
            <h2 style={{fontSize: '1.8rem', fontWeight: '700'}}>Preferences & Goals</h2>
            <div><label style={labelStyle}>Dietary Restrictions</label><textarea name="dietaryRestrictions" value={formData.dietaryRestrictions} onChange={handleChange} placeholder="Allergies, intolerances, vegetarian, etc." style={{...inputStyle, minHeight: '60px', resize: 'vertical'}}/></div>
            <div><label style={labelStyle}>Foods You Dislike</label><input type="text" name="dislikedFoods" value={formData.dislikedFoods} onChange={handleChange} placeholder="e.g., Mushrooms, Brussels sprouts" style={inputStyle}/></div>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
              <div><label style={labelStyle}>Cooking Skill</label><select name="cookingSkill" value={formData.cookingSkill} onChange={handleChange} style={inputStyle}><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></select></div>
              <div><label style={labelStyle}>Time to Cook</label><select name="timeToCook" value={formData.timeToCook} onChange={handleChange} style={inputStyle}><option value="15min">15 minutes</option><option value="30min">30 minutes</option><option value="60min">1 hour</option></select></div>
            </div>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
              <div><label style={labelStyle}>Meals Per Day</label><select name="mealsPerDay" value={formData.mealsPerDay} onChange={handleChange} style={inputStyle}><option value="2">2 (OMAD/IF)</option><option value="3">3 meals</option><option value="4">3 + snacks</option></select></div>
              <div><label style={labelStyle}>Budget</label><select name="budget" value={formData.budget} onChange={handleChange} style={inputStyle}><option value="low">Budget-Friendly</option><option value="moderate">Moderate</option><option value="high">Premium</option></select></div>
            </div>
            <div><label style={labelStyle}>Primary Goal *</label><select name="goal" value={formData.goal} onChange={handleChange} style={inputStyle}><option value="weightLoss">Weight Loss</option><option value="muscle">Build Muscle</option><option value="maintenance">Maintain Weight</option><option value="energy">Increase Energy</option></select></div>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
              <div><label style={labelStyle}>Target Weight (lbs)</label><input type="number" name="targetWeight" value={formData.targetWeight} onChange={handleChange} placeholder="160" style={inputStyle}/></div>
              <div><label style={labelStyle}>Timeline</label><select name="timeline" value={formData.timeline} onChange={handleChange} style={inputStyle}><option value="4weeks">4 Weeks</option><option value="12weeks">12 Weeks</option><option value="6months">6 Months</option></select></div>
            </div>
            <div style={{display: 'flex', gap: '1rem'}}>
              <button onClick={() => setCurrentPage(1)} style={{flex: 1, padding: '1rem', background: 'white', color: '#10B981', border: '2px solid #10B981', borderRadius: '8px', fontSize: '1.1rem', fontWeight: '600', cursor: 'pointer'}}><ArrowLeft/> Back</button>
              <button onClick={generate} disabled={loading} style={{flex: 2, padding: '1rem', background: loading ? '#9ca3af' : 'linear-gradient(135deg, #10B981 0%, #84CC16 100%)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'}}>
                {loading ? <><Loader className="spinning"/>Generating...</> : <>Generate Meal Plan</>}
              </button>
            </div>
          </div>
        )}

        {currentPage === 3 && plan && (
          <div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
              <h2 style={{fontSize: '1.8rem', fontWeight: '700'}}>Your Keto Meal Plan</h2>
              <button onClick={download} style={{padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg, #10B981 0%, #84CC16 100%)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem'}}><Download/>Download</button>
            </div>
            <div style={{background: '#f9fafb', padding: '2rem', borderRadius: '12px', marginBottom: '2rem', maxHeight: '600px', overflowY: 'auto', border: '1px solid #e5e7eb'}}>
              <pre style={{whiteSpace: 'pre-wrap', fontFamily: 'Georgia, serif', fontSize: '0.95rem', lineHeight: '1.8', color: '#1a1a1a'}}>{plan}</pre>
            </div>
            <button onClick={() => {setCurrentPage(1); setPlan(null);}} style={{width: '100%', padding: '1rem', background: 'white', color: '#10B981', border: '2px solid #10B981', borderRadius: '8px', fontSize: '1.1rem', fontWeight: '600', cursor: 'pointer'}}>Create Another Plan</button>
          </div>
        )}
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}.spinning{animation:spin 1s linear infinite}`}</style>
    </div>
  );
}
