"use client"

import { useState } from "react"
import Step1Welcome from "@/components/onboarding/Step1Welcome"
import Step2Wallet from "@/components/onboarding/Step2Wallet"
import Step3Profile from "@/components/onboarding/Step3Profile"
import Step4Avatar from "@/components/onboarding/Step4Avatar"
import Step5Completed from "@/components/onboarding/Step5Completed"

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0)
  const [profileData, setProfileData] = useState({ name: "", bio: "" })
  const [avatarData, setAvatarData] = useState({
    gender: "female",
    skinTone: "light",
    hair: "long",
  })

  const steps = [
    <Step1Welcome key="1" onNext={() => setCurrentStep(1)} />,
    <Step2Wallet key="2" onNext={() => setCurrentStep(2)} onBack={() => setCurrentStep(0)} />,
    <Step3Profile
      key="3"
      profileData={profileData}
      setProfileData={setProfileData}
      onNext={() => setCurrentStep(3)}
      onBack={() => setCurrentStep(1)}
    />,
    <Step4Avatar
      key="4"
      avatarData={avatarData}
      setAvatarData={setAvatarData}
      onNext={() => setCurrentStep(4)}
      onBack={() => setCurrentStep(2)}
    />,
    <Step5Completed key="5" profileData={profileData} avatarData={avatarData} />,
  ]

  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <div style={{ minHeight: "100vh", padding: "20px", display: "flex", flexDirection: "column" }}>
      {/* Progress Bar */}
      <div className="stepper-progress">
        <div className="stepper-progress-bar" style={{ width: `${progress}%` }} />
      </div>

      {/* Step Content */}
      <div style={{ flex: 1 }}>{steps[currentStep]}</div>
    </div>
  )
}
