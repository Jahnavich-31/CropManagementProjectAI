import React, { useState } from "react";
import { Camera, Upload, Eye, Zap, Save, Download, Share, CheckCircle, AlertTriangle, History } from "lucide-react";
import { Card } from "react-bootstrap";
import { BiSolidCheckShield } from "react-icons/bi";


export default function DiseaseDetection() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [cropType, setCropType] = useState("");
  const [activeTab, setActiveTab] = useState("💊 Treatment Plan");

  const [analysisHistory, setAnalysisHistory] = useState([
    {
      id: 1,
      image: "https://via.placeholder.com/100",
      crop: "Tomato",
      disease: "Healthy",
      confidence: 98,
      date: "2024-01-15",
      status: "healthy",
      location: "Field A, Row 12",
      treatment: "No treatment needed"
    },
    {
      id: 2,
      image: "https://via.placeholder.com/100",
      crop: "Potato",
      disease: "Late Blight",
      confidence: 92,
      date: "2024-01-14",
      status: "diseased",
      location: "Field B, Row 5",
      treatment: "Applied copper fungicide"
    },
    {
      id: 3,
      image: "https://via.placeholder.com/100",
      crop: "Corn",
      disease: "Healthy",
      confidence: 96,
      date: "2024-01-13",
      status: "healthy",
      location: "Field C, Row 8",
      treatment: "Preventive care only"
    }
  ]);

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result);
        setAnalysisResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = () => {
    if (!selectedImage) {
      alert("Please select an image and crop type first!");
      return;
    }

    setIsAnalyzing(true);

    setTimeout(() => {
      const results = {
        tomato: {
          disease: "Early Blight",
          confidence: 94,
          severity: "Moderate",
          stage: "Early development",
          affectedArea: "15%",
          recommendations: [
            "Apply copper-based fungicide immediately",
            "Improve air circulation around plants",
            "Remove affected leaves and dispose properly",
            "Monitor closely for 7-10 days"
          ],
          preventiveMeasures: [
            "Ensure proper plant spacing",
            "Water at soil level, not on leaves",
            "Apply preventive fungicide every 2 weeks",
            "Rotate crops annually"
          ]
        },
        corn: {
          disease: "Healthy",
          confidence: 98,
          severity: "None",
          stage: "Healthy growth",
          affectedArea: "0%",
          recommendations: [
            "Continue current care routine",
            "Monitor for pest activity",
            "Maintain optimal soil moisture",
            "Consider preventive treatments"
          ],
          preventiveMeasures: [
            "Regular field inspections",
            "Proper nutrient management",
            "Integrated pest management",
            "Crop rotation planning"
          ]
        },
        potato: {
          disease: "Colorado Potato Beetle Damage",
          confidence: 89,
          severity: "High",
          stage: "Active infestation",
          affectedArea: "25%",
          recommendations: [
            "Apply targeted insecticide treatment",
            "Hand-pick beetles if infestation is localized",
            "Inspect neighboring plants immediately",
            "Consider biological control agents"
          ],
          preventiveMeasures: [
            "Early season monitoring",
            "Beneficial insect habitat",
            "Resistant variety selection",
            "Crop rotation with non-solanaceous crops"
          ]
        }
      };

      const result = results[cropType] || results.tomato;
      setAnalysisResult(result);

      const newScan = {
        id: analysisHistory.length + 1,
        image: selectedImage,
        crop: cropType.charAt(0).toUpperCase() + cropType.slice(1),
        disease: result.disease,
        confidence: result.confidence,
        date: new Date().toISOString().split("T")[0],
        status: result.disease === "Healthy" ? "healthy" : "diseased",
        location: `Field ${String.fromCharCode(
          65 + Math.floor(Math.random() * 3)
        )}, Row ${Math.floor(Math.random() * 20) + 1}`,
        treatment:
          result.disease === "Healthy" ? "No treatment needed" : "Treatment recommended"
      };

      setAnalysisHistory([newScan, ...analysisHistory]);
      setIsAnalyzing(false);
    }, 3000);
  };

  return (
    <div className="min-vh-100 bg-light py-4">
    <div className="px-5 py-2 ">
      
      {/* Header */}
      <div className="card border mb-4">
        <div className="">
          <h1 className="card-title text-success fw-bold fs-3">🔬 AI Disease Detection</h1>
          <p className="text-muted">Upload plant images for instant disease identification and treatment recommendations</p>
          <div className="row mt-3">
            <div className="col-md-4">
              <div className="p-3 bg-success bg-opacity-10 rounded">
                <h4 className="text-success mb-0">98.5%</h4>
                <small className="text-muted">Accuracy Rate</small>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-3 bg-warning bg-opacity-10 rounded">
                <h4 className="text-warning mb-0">{analysisHistory.length}</h4>
                <small className="text-muted">Total Scans</small>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-3 bg-success bg-opacity-10 rounded">
                <h4 className="text-success mb-0">15</h4>
                <small className="text-muted">Diseases Detected</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Section */}
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card">
            <div className=" text-success fw-bold fs-5 ms-2">
              <Camera size={18} className="me-2" />
              Plant Health Analysis
            </div>
            <p className="mt-1 ms-2" >Upload a photo and select crop type for AI-powered disease detection</p>
            <div className="">
              
              {/* Crop Type Selection */}
              {/* <div className="mb-3">
                <label className="form-label text-success">Select Crop Type *</label>
                <select className="form-select border-success" value={cropType} onChange={(e) => setCropType(e.target.value)}>
                  <option value="">Choose your crop type</option>
                  <option value="tomato">🍅 Tomato</option>
                  <option value="potato">🥔 Potato</option>
                  <option value="corn">🌽 Corn</option>
                  <option value="wheat">🌾 Wheat</option>
                  <option value="soybean">🫘 Soybean</option>
                  <option value="lettuce">🥬 Lettuce</option>
                </select>
              </div> */}

              {/* Image Upload */}
              <div className="rounded-lg p-2 text-center bg-green-50">
                {selectedImage ? (
                  <>
                    <img src={selectedImage} alt="Uploaded crop" className="img-fluid rounded mb-3" style={{ maxHeight: "250px" }} />
                    <div className="d-flex justify-content-center gap-2">
                      <label className="btn btn-outline-success mb-0">
                        <Upload size={16} className="me-1" /> Change Image
                        <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
                      </label>
                      <button 
                        className="btn btn-warning text-white"
                        onClick={analyzeImage}
                        disabled={isAnalyzing}
                      >
                        {isAnalyzing ? (
                          <>
                            <Zap size={16} className="me-1 spinner-border spinner-border-sm" /> Analyzing...
                          </>
                        ) : (
                          <>
                            <Eye size={16} className="me-1" /> Analyze Plant
                          </>
                        )}
                      </button>
                    </div>
                  </>
                ) : (
                  <div  className="py-3" style={{backgroundColor:"#f5f8f5",borderStyle:"dashed",borderColor:"green",borderRadius:"10px"}} >
                  
                    <div className="d-flex justify-content-center">
                    <Camera size={50} className="text-success mb-3" />
                    <h4 className="fs-6 mt-3" >Upload Plant Image
                    </h4>
                      </div>
                    <p className="text-muted">Take a clear photo of the affected plant part for accurate analysis.<br/> Ensure good lighting and focus on the problematic area.</p>
                  <label className="btn btn-success mb-0 w-25">
                  <div className="d-flex justify-content-center">
                      <Upload size={16} className="me-2 mt-1" /> Choose Image
                      <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
                    </div>
                    </label>
                  
                  </div>
                )}
              </div>

              {/* Analysis Results */}
              {analysisResult && (
                <div className={`mt-4 p-3 border rounded ${analysisResult.disease === "Healthy" ? "border-success" : "border-warning"}`}>
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className={analysisResult.disease === "Healthy" ? "text-success" : "text-warning"}>🔍 Detection Results</h5>
                    <div className="d-flex gap-2">
                      <span className={`badge ${analysisResult.disease === "Healthy" ? "bg-success" : "bg-warning h-25"}`}>
                        {analysisResult.confidence}% Confidence
                      </span>
                
                    </div>
                  </div>
                  
                  {/* Details Table */}
                  <table className="table table-sm mt-3">
                    <tbody>
                      <tr><th>Disease:</th><td>{analysisResult.disease}</td></tr>
                      <tr><th>Severity:</th><td>{analysisResult.severity}</td></tr>
                      <tr><th>Stage:</th><td>{analysisResult.stage}</td></tr>
                      <tr><th>Affected Area:</th><td>{analysisResult.affectedArea}</td></tr>
                    </tbody>
                  </table>

                  {/* Action Buttons */}
                  <div className="d-flex gap-2">
                    <button className="btn btn-outline-success btn-sm" onClick={()=>{

                    }}>
                      <Download size={14} className="me-1" /> Download Report
                    </button>
                    <button className="btn btn-outline-warning btn-sm" onClick={()=>{

                    }}>
                      <Share size={14} className="me-1" /> Share with Advisor
                    </button>
                  </div>

                  <div className="d-flex justify-content-center m-2 mb-4">
          <div className="d-flex bg-light rounded-3 shadow-sm w-100" style={{}}>
            {["💊 Treatment Plan","🛡️ Prevention"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-fill btn border-0 fw-semibold py-2 ${
                  activeTab === tab
                    ? "bg-white text-success shadow-sm rounded-3"
                    : "text-muted"
                }`}
              >
               {tab.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}
              </button>
            ))}
          </div>
        </div>

        
                  <div className="tab-content border border-top-0 p-3">
                    {activeTab === "💊 Treatment Plan" &&  <div className="tab-pane fade show active" id="treatment">
                      <h6 className="text-success">Immediate Actions Required</h6>
                      {analysisResult.recommendations.map((rec, i) => (
                        <div key={i} className="d-flex align-items-start mb-2">
                          <CheckCircle size={16} className="text-success me-2" /> {rec}
                        </div>
                      ))}
                    </div>}
                    {activeTab==="🛡️ Prevention" &&  <div className={`tab-pane fade ${activeTab === '🛡️ Prevention' ? 'show active' : ''}`} id="prevention">
                      <h6 className="text-success">Preventive Measures</h6>
                      {analysisResult.preventiveMeasures.map((m, i) => (
                        <div key={i} className="d-flex align-items-start mb-2">
                          <CheckCircle size={16} className="text-success me-2" /> {m}
                        </div>
                      ))}
                    </div>}
                   
                   
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-lg-4">
          {/* Recent Scans */}
          <div className="card mb-3 p-0">
          <Card.Header style={{ backgroundColor: 'transparent',padding: '1rem' }}>
                <h5 className="mt-0 mb-0 fw-bold text-left fs-6 text-success" >🔄 Recent Analysis</h5>
              </Card.Header>
           
            <div className="card-body">
              {analysisHistory.length === 0 ? (
                <p className="text-muted">No scans yet</p>
              ) : (
                analysisHistory.slice(0, 4).map((scan) => (
                  <div key={scan.id} className="p-2 mb-2 border rounded">
                    <strong>{scan.crop}</strong> - {scan.disease}
                  </div>
                ))
              )}
              {/* <button className="btn btn-outline-success w-100">
                View All Scans ({analysisHistory.length})
              </button> */}
            </div>
          </div>

          {/* Photography Tips */}
          <div className="card p-0 mb-3" style={{ }} >
            <Card.Header style={{ backgroundColor: 'transparent',padding: '1rem' }}>
                <h5 className="mt-0 mb-0 fw-bold text-left fs-6 text-success" >📸 Photography Tips</h5>
              </Card.Header>
            <div className=" text-muted small px-3 py-2">
              <p><BiSolidCheckShield color="#28a745" size={"20px"} /> Use natural lighting when possible  </p>
              <p><BiSolidCheckShield color="#28a745" size={"20px"} /> Focus on affected plant parts</p>
              <p><BiSolidCheckShield color="#28a745" size={"20px"} /> Avoid blurry or dark images</p>
              <p><BiSolidCheckShield color="#28a745" size={"20px"} /> Include surrounding healthy tissue for context </p>
              <p><BiSolidCheckShield color="#28a745" size={"20px"} /> Take multiple angles if symptoms are unclear</p>
            </div>
          </div>

          {/* Stats */}
          <Card className="p-0">
              <Card.Header style={{ backgroundColor: 'transparent',padding: '1rem' }}>
                <h5 className="text-success mt-0 mb-0 fw-bold text-left fs-6">📊 Your Analysis Stats</h5>
              </Card.Header>
              <Card.Body className="text-center">
                <div className="p-3 bg-success bg-opacity-10 rounded">
                  <div className="text-success fw-bold">{analysisHistory.filter(s => s.status === "healthy").length}</div>
                  <div className="text-muted small">Healthy Plants</div>
                </div>
                <div className=" mt-3" style={{display:'flex',justifyContent:'space-between',flexDirection:'row'}}>
                  <div className="col-6 p-2 bg-warning bg-opacity-10 rounded">
                    <div className="text-warning fw-bold">{analysisHistory.filter(s => s.status === "diseased").length}</div>
                    <div className="text-muted small">Issues Found</div>
                  </div>
                  <div className="col-6 p-2 bg-success bg-opacity-10 rounded ms-2">
                    <div className="text-success fw-bold">98%</div>
                    <div className="text-muted small">Avg Accuracy</div>
                  </div>
                </div>
              </Card.Body>
            </Card>

        </div>
      </div>

    </div>
  </div>
  );
}
