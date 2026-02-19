import { assetPath } from "@/lib/assetPath";

const CLOUD_VIDEO_SRC = assetPath("/background/clouds.mp4");
const FALLBACK_VIDEO_SRC = assetPath("/background/bck1.mp4");

export function BackgroundVideo() {
  return (
    <div aria-hidden="true" className="bg-video">
      <video className="bg-video__media" autoPlay muted loop playsInline preload="auto">
        <source src={CLOUD_VIDEO_SRC} type="video/mp4" />
        <source src={FALLBACK_VIDEO_SRC} type="video/mp4" />
      </video>
      <div className="bg-video__overlay" />
    </div>
  );
}
