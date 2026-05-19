import { useState } from "react";
import axios from "axios";
import {
  PlaySquare,
  X,
  ShieldCheck,
  Zap,
  Download,
  Smartphone,
  Music,
  Video,
} from "lucide-react";

const BASE_URL = "http://127.0.0.1:8000";

function App() {

  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState(null);

  // FORMAT COUNTS

  const formatNumber = (num) => {

    if (!num) return "N/A";

    const number = Number(num);

    if (number >= 1000000000) {
      return (number / 1000000000).toFixed(1) + "B";
    }

    if (number >= 1000000) {
      return (number / 1000000).toFixed(1) + "M";
    }

    if (number >= 1000) {
      return (number / 1000).toFixed(1) + "K";
    }

    return number.toString();
  };

  // FETCH VIDEO INFO

  const fetchVideoInfo = async () => {

    if (!url) return;

    try {

      setLoading(true);

      const response = await axios.get(
        `${BASE_URL}/info?url=${encodeURIComponent(url)}`
      );

      setVideoInfo(response.data);

    } catch (error) {

      console.log(error);

      alert("Failed to fetch video information.");

    } finally {

      setLoading(false);

    }
  };

  // DOWNLOAD VIDEO

  const downloadVideo = () => {

    window.location.href =
      `${BASE_URL}/download?url=${encodeURIComponent(url)}&format_id=best`;
  };

  // DOWNLOAD AUDIO

  const downloadAudio = () => {

    window.location.href =
      `${BASE_URL}/audio?url=${encodeURIComponent(url)}`;
  };

  // DOWNLOAD THUMBNAIL

  const downloadThumbnail = () => {

    window.location.href =
      `${BASE_URL}/thumbnail?url=${encodeURIComponent(url)}`;
  };

  return (

    <div className="min-h-screen bg-[#050816] text-white overflow-x-hidden">

      {/* NAVBAR */}

      <nav className="fixed top-0 left-0 w-full z-50 bg-black/30 backdrop-blur-xl border-b border-white/10">

        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

          <h1 className="text-4xl font-black bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
            YTDownloaderX
          </h1>

          <div className="hidden md:flex gap-10 text-white/70 font-semibold">

            <a
              href="#features"
              className="hover:text-cyan-400 transition"
            >
              Features
            </a>

            <a
              href="#hero-section"
              className="hover:text-cyan-400 transition"
            >
              Downloader
            </a>

            <a
              href="#faq"
              className="hover:text-cyan-400 transition"
            >
              FAQ
            </a>

          </div>

        </div>

      </nav>

      {/* HERO SECTION */}

      <section
        id="hero-section"
        className="pt-40 pb-24 px-6 relative"
      >

        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-600/20 blur-[120px] rounded-full"></div>

        <div className="absolute bottom-10 right-20 w-72 h-72 bg-cyan-500/20 blur-[120px] rounded-full"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">

          <h1 className="text-6xl md:text-8xl font-black leading-tight mb-8">

            <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
              Download YouTube
            </span>

            <br />

            Videos Instantly

          </h1>

          <p className="text-white/70 text-xl md:text-2xl mb-12 leading-relaxed">
            The fastest and most premium YouTube downloader experience with
            ultra-fast video, audio and thumbnail downloads in one click.
          </p>

          {/* INPUT AREA */}

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-2xl">

            <div className="flex flex-col md:flex-row gap-4">

              <div className="flex-1 relative">

                <PlaySquare
                  size={30}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-red-500"
                />

                <input
                  type="text"
                  placeholder="Paste YouTube URL here..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-[#020617] border border-white/10 rounded-2xl pl-16 pr-14 py-5 text-white outline-none text-lg"
                />

                {url && (

                  <button
                    onClick={() => setUrl("")}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-white/50 hover:text-red-400 transition"
                  >
                    <X size={20} />
                  </button>

                )}

              </div>

              <button
                onClick={fetchVideoInfo}
                className="bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 px-10 py-5 rounded-2xl font-bold text-lg hover:scale-105 transition duration-300"
              >

                {loading ? "Fetching..." : "Fetch Video"}

              </button>

            </div>

          </div>

          {/* VIDEO DETAILS BELOW URL AREA */}

          {videoInfo && (

            <div className="mt-12 bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl text-left">

              <img
                src={videoInfo.thumbnail}
                alt=""
                className="w-full h-[420px] object-cover"
              />

              <div className="p-8">

                <h2 className="text-4xl font-black mb-10 leading-tight">
                  {videoInfo.title}
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                    <p className="text-white/50 mb-2">Channel</p>
                    <h3 className="font-bold">
                      {videoInfo.channel || "Unknown"}
                    </h3>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                    <p className="text-white/50 mb-2">Views</p>
                    <h3 className="font-bold text-cyan-400">
                      {formatNumber(videoInfo.views)}
                    </h3>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                    <p className="text-white/50 mb-2">Likes</p>
                    <h3 className="font-bold text-pink-400">
                      {formatNumber(videoInfo.likes)}
                    </h3>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                    <p className="text-white/50 mb-2">Subscribers</p>
                    <h3 className="font-bold text-purple-400">
                      {formatNumber(videoInfo.subscribers)}
                    </h3>
                  </div>

                </div>

                <div className="grid md:grid-cols-3 gap-6">

                  <button
                    onClick={downloadVideo}
                    className="bg-gradient-to-r from-purple-600 to-pink-500 py-5 rounded-2xl text-xl font-bold hover:scale-105 transition"
                  >
                    Download Video
                  </button>

                  <button
                    onClick={downloadAudio}
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 py-5 rounded-2xl text-xl font-bold hover:scale-105 transition"
                  >
                    Download Audio
                  </button>

                  <button
                    onClick={downloadThumbnail}
                    className="bg-gradient-to-r from-pink-500 to-rose-500 py-5 rounded-2xl text-xl font-bold hover:scale-105 transition"
                  >
                    Download Thumbnail
                  </button>

                </div>

              </div>

            </div>

          )}

        </div>

      </section>

      {/* HR */}

      <hr className="border-white/10" />

      {/* FEATURES */}

      <section
        id="features"
        className="py-24 px-6"
      >

        <div className="max-w-7xl mx-auto">

          <h2 className="text-6xl font-black text-center mb-20 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Premium Features
          </h2>

          <div className="grid md:grid-cols-3 gap-8">

            <div className="bg-white/5 border border-white/10 rounded-3xl p-10 hover:scale-105 transition duration-300">

              <Zap size={50} className="text-cyan-400 mb-6" />

              <h3 className="text-3xl font-bold mb-4">
                Ultra Fast Downloads
              </h3>

              <p className="text-white/70 leading-relaxed">
                Download YouTube videos within seconds using optimized
                downloading technology built for speed and performance.
              </p>

            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-10 hover:scale-105 transition duration-300">

              <ShieldCheck size={50} className="text-pink-400 mb-6" />

              <h3 className="text-3xl font-bold mb-4">
                100% Secure Platform
              </h3>

              <p className="text-white/70 leading-relaxed">
                Your downloads remain private and secure with no tracking,
                hidden malware or suspicious redirects.
              </p>

            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-10 hover:scale-105 transition duration-300">

              <Download size={50} className="text-purple-400 mb-6" />

              <h3 className="text-3xl font-bold mb-4">
                HD Video Quality
              </h3>

              <p className="text-white/70 leading-relaxed">
                Enjoy crystal clear video downloads with smooth playback and
                premium viewing quality.
              </p>

            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-10 hover:scale-105 transition duration-300">

              <Music size={50} className="text-cyan-400 mb-6" />

              <h3 className="text-3xl font-bold mb-4">
                Audio Extraction
              </h3>

              <p className="text-white/70 leading-relaxed">
                Instantly convert YouTube videos into high quality audio files.
              </p>

            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-10 hover:scale-105 transition duration-300">

              <Video size={50} className="text-pink-400 mb-6" />

              <h3 className="text-3xl font-bold mb-4">
                Thumbnail Downloads
              </h3>

              <p className="text-white/70 leading-relaxed">
                Save original YouTube thumbnails instantly in high quality.
              </p>

            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-10 hover:scale-105 transition duration-300">

              <Smartphone size={50} className="text-purple-400 mb-6" />

              <h3 className="text-3xl font-bold mb-4">
                Mobile Responsive
              </h3>

              <p className="text-white/70 leading-relaxed">
                Works beautifully across desktop, mobile and tablet devices.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* HR */}

      <hr className="border-white/10" />

      {/* FAQ */}

      <section
        id="faq"
        className="py-24 px-6"
      >

        <div className="max-w-6xl mx-auto">

          <h2 className="text-6xl font-black text-center mb-20 bg-gradient-to-r from-purple-500 to-cyan-400 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>

          <div className="space-y-8">

            <div className="bg-white/5 border border-white/10 rounded-3xl p-10">
              <h3 className="text-3xl font-bold mb-5 text-cyan-400">
                Is YTDownloaderX completely secure?
              </h3>
              <p className="text-white/70 text-lg leading-relaxed">
                Absolutely. YTDownloaderX is designed with security and privacy
                in mind. We never store your downloads or personal information.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-10">
              <h3 className="text-3xl font-bold mb-5 text-pink-400">
                Can I use this downloader on mobile devices?
              </h3>
              <p className="text-white/70 text-lg leading-relaxed">
                Yes. The platform is optimized for smartphones, tablets and
                desktops with smooth responsiveness.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-10">
              <h3 className="text-3xl font-bold mb-5 text-purple-400">
                Does it support HD quality downloads?
              </h3>
              <p className="text-white/70 text-lg leading-relaxed">
                Yes. YTDownloaderX supports crystal clear HD video downloads
                with premium playback quality.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-10">
              <h3 className="text-3xl font-bold mb-5 text-cyan-400">
                Is there any download limit?
              </h3>
              <p className="text-white/70 text-lg leading-relaxed">
                No. You can enjoy unlimited downloads anytime without
                restrictions.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-10">
              <h3 className="text-3xl font-bold mb-5 text-pink-400">
                Why should I choose YTDownloaderX?
              </h3>
              <p className="text-white/70 text-lg leading-relaxed">
                YTDownloaderX combines speed, security, premium UI and
                ultra-fast downloads in one modern platform.
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* HR */}

      <hr className="border-white/10" />

      {/* FOOTER */}

      <footer className="py-12 text-center text-white/50">

        <h3 className="text-4xl font-black mb-5 bg-gradient-to-r from-purple-500 to-cyan-400 bg-clip-text text-transparent">
          YTDownloaderX
        </h3>

        <p className="text-lg">
          © 2026 YTDownloaderX. All Rights Reserved.
        </p>

      </footer>

    </div>
  );
}

export default App;