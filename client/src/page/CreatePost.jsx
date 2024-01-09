import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { preview } from '../assets';
import { getRandomPrompt } from '../utils';
import { FormField, Loader } from '../components';

const CreatePost = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: 'AdamAi',
    prompt: '',
    photo: '',
  });

  const [generatingImg, setGeneratingImg] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.prompt);
    setForm({ ...form, prompt: randomPrompt });
  };

  const generateImage = async () => {
    if (form.prompt) {
      try {
        setGeneratingImg(true);
        const response = await fetch('https://adamai-image-kb7e.onrender.com/api/v1/dalle', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: form.prompt,
          }),
        });

        const data = await response.json();
        setForm({ ...form, photo: `data:image/jpeg;base64,${data.photo}` });
      } catch (err) {
        alert(err);
      } finally {
        setGeneratingImg(false);
      }
    } else {
      alert('Please provide proper prompt');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.prompt && form.photo) {
      setLoading(true);
      try {
        const response = await fetch('https://adamai-image-kb7e.onrender.com/api/v1/post', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...form }),
        });

        await response.json();
       
        navigate('/');
      } catch (err) {
        alert(err);
      } finally {
        setLoading(false);
      }
      window.location.reload();

    } else {
      alert('Please generate an image with proper details');
    }
    
  };

  return (
    <section className="max-w-4xl mx-auto">
      <div>
        <h1 className="font-extrabold text-[#222328] text-4xl">Create imaginative images of me, AdamAi 😅</h1>
        <p className="mt-1 text-[#666e75]  max-w-2xl ">Generate images of my pixel doing whatever you like. Whether it's fighting off zombies😱 or riding a dragon🐉, the choice is yours🙌. </p>
      </div>

      <form onSubmit={handleSubmit}
      onKeyPress={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          generateImage();
        }
      }}>
      <div className='mt-5 max-w-3xl'>
          <FormField
            labelName="Prompt"
            type="text"
            name="prompt"
            placeholder="Example: fighting off ghost 👻👻👻🤺"
            value={form.prompt}
            handleChange={handleChange}
            isSurpriseMe
            handleSurpriseMe={handleSurpriseMe}
          />
      </div>

        <div className="flex justify-center text-center flex-col">
          <div className="self-center m-5 border border-[1rem] rounded-xl border-gray-500  p-1">
            { form.photo ? (
              <img
                src={form.photo}
                alt={form.prompt}
                className="w-[15rem] h-[15rem] object-contain "
              />
            ) : (
              <img
                src={preview}
                alt="preview"
                className=" object-contain w-[15rem] h-[15rem] "
              />
            )}

            {generatingImg && (
              <div className="">
                <Loader />
              </div>
            )}
          </div>

        <div className="self-center">
          <button
            type="button"
            onClick={generateImage}
            className=" text-white bg-blue-500 font-medium rounded-md md:mr-5  text-3xl w-full sm:w-auto  h-[4rem] px-4 text-center"
          >
            {generatingImg ? 'Creating...' : '🤖 Create'}
          </button>
          <button
            type="submit"
            className=" text-white bg-gray-500 font-medium md:ml-5 rounded-md text-3xl w-full sm:w-auto h-[4rem] px-8 text-center"
          >
            {loading ? 'Saving...' : '👇 Save'}
          </button>
        </div>
        </div>
    
      </form>
    </section>
  );
};

export default CreatePost;
