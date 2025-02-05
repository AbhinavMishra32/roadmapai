import LoadingAnimation from "./loading-animation";

export default function LoadingAnimationPage() {
  return (
    <div className="fixed top-0 left-0 z-[51] flex items-center justify-center w-full h-screen bg-gray-950">
      <LoadingAnimation />
    </div>
  )
}