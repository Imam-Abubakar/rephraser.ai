import { useState, useRef } from "react";
import { Toaster, toast } from "react-hot-toast";
import { ClipLoader } from "react-spinners";


export default function Home() {

  const [originalText, setOriginalText] = useState<string>("");
  const [paraphrasedText, setParaphrasedText] = useState<string>("");
  const [paraphraseMode, setParaphraseMode] = useState<string>("Standard");

  const textAreaRef = useRef(null);

  const [loading, setLoading] = useState<boolean>(false);

  const prompt = `Paraphrase "${originalText}" using ${paraphraseMode} mode. Do not add any additional word.`;

  const handleParaphrase = async (e: React.FormEvent) => {
    if (!originalText) {
      toast.error("Enter text to paraphrase!");
      return;
    }
    setLoading(true);

    
    const response = await fetch("/api/paraphrase", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });

    const data = await response.json();

    console.log(data)

    setParaphrasedText(data.choices[0].message.content);

    setLoading(false);
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <main className="max-w-2xl w-full bg-white rounded-lg shadow-md p-6 mb-4">
        <h1 className="text-4xl font-bold mb-4">Rephraser.ai</h1>
        <p className="text-sm mb-8">
          Enter the text you want to rephrase below, select a rephrase tone,
          and click on the Rephrase button to see the results!
        </p>
        <div className="mb-4">
          <textarea
            onChange={(e) => setOriginalText(e.target.value)}
            value={originalText}
            rows={6}
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full h-96 p-4 sm:text-lg border-gray-300 rounded-md border"
            placeholder="Enter text to paraphrase"
          ></textarea>
          <div className="mb-4 flex items-center justify-between w-full">
            <div className="mr-2"></div>
            <span className="text-sm font-bold">
              {originalText &&
                originalText.trim().split(/\s+/).length + ` word(s)`}
            </span>
          </div>
        </div>

        <div className="mb-4">
          <select
            value={paraphraseMode}
            onChange={(e) => setParaphraseMode(e.target.value)}
            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="Standard">Standard</option>
            <option value="Formal">Formal</option>
            <option value="Creative">Creative</option>
            <option value="Fun">Fun</option>
            <option value="Fluent">Fluent</option>
          </select>
        </div>
        <div className="mb-4">
          <button
            onClick={handleParaphrase}
            className="inline-block px-4 py-2 leading-none border rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:bg-blue-700"
          >
            Rephrase
          </button>
        </div>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ duration: 3000 }}
        />

        {loading && (
          <div className="loader-overlay">
            <ClipLoader size={60} color={"#ffffff"} loading={loading} />
          </div>
        )}

        {paraphrasedText && (
          <div className="flex flex-col items-center justify-center w-full">
            <h2 className="text-xl font-bold mb-2 flex items-center">
              Paraphrased Text{" "}
              <button
                title="Copy"
                onClick={() => {
                  navigator.clipboard.writeText(paraphrasedText);
                  toast.success("Copied to clipboard");
                }}
                className="bg-blue-600 hover:bg-blue-800 text-white text-lg h-8 w-7 rounded-full ml-3 focus:outline-none cursor-pointer"
              >
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <rect x="8" y="8" width="12" height="12" rx="2" />
                  <path d="M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2" />
                </svg>
              </button>
            </h2>
            <p
              className="p-4 sm:text-lg border-gray-300 rounded-md bg-gray-100 mt-2 sm:mt-0 w-full"
              style={{ whiteSpace: "pre-wrap" }}
            >
              {paraphrasedText}
            </p>
          </div>
        )}
      </main>
      <footer className="text-gray-600 text-center text-md mt-2">
        Built with Next.js, Tailwind CSS, and OpenAI
      </footer>
    </div>
  );
}
