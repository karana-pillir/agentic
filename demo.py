import google.generativeai as genai
import os

genai.configure(api_key=os.environ["GEMINI_API_KEY"])

model = genai.GenerativeModel('gemini-2.5-flash')
input_prompt = input("Enter your prompt: ")
response = model.generate_content(
    contents=input_prompt,
)

print(response.text)

### Another way to do it(gemini-1.5-flash)
#import google.generativeai as genai
#import os

#genai.configure(api_key=os.environ["GEMINI_API_KEY"])

# model = genai.GenerativeModel('gemini-1.5-flash')

# response = model.generate_content("Hello, Gemini!")

# print(response.text)