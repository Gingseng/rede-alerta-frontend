import { useEffect } from "react";

export default function AdBanner() {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("Erro no AdSense:", e);
    }
  }, []);

  return (
    <div className="my-6 flex justify-center">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-8005370036073215"
        data-ad-slot="1234567890" // 🔥 você vai trocar isso pelo ID do AdSense
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}