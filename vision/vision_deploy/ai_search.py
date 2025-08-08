import aiohttp
import asyncio
import nest_asyncio
from bs4 import BeautifulSoup
from concurrent.futures import ThreadPoolExecutor
import requests
from google import genai
from dotenv import load_dotenv
import os
import json

load_dotenv()  # load environment variables from .env file
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

total_results_to_fetch = 3  # total number of results to fetch

# Apply the nest_asyncio patch
# nest_asyncio.apply()

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
}

client = genai.Client(api_key=GEMINI_API_KEY)

async def fetch(session, url, params=None):
    async with session.get(url, params=params, headers=headers, timeout=30) as response:
        return await response.text()

async def google_search(query, results, num_results=total_results_to_fetch):
    """
    Perform a Google search and append the results to the provided list.

    :param query: The search query.
    :param api_key: Your Google API key.
    :param cse_id: Your Custom Search Engine ID.
    :param results: The list to append the results to.
    :param num_results: The number of results to fetch.
    """
    print("Searching for:", query)
    search_url = "https://www.googleapis.com/customsearch/v1"
    params = {
        'q': query,
        'key': GOOGLE_API_KEY,
        'cx': "a2991ece49c8941ec",
        'num': num_results
    }
    response = requests.get(search_url, params=params)
    search_results = response.json()

    for item in search_results.get('items', []):
        print("adding item", item['title'])
        results.append({
            'title': item['title'],
            'links': item['link']
        })

def get_all_text_from_url(url):
    response = requests.get(url, headers=headers, timeout=30)
    soup = BeautifulSoup(response.text, 'html.parser')
    for script in soup(["script", "style"]):
        script.extract()
    text = soup.get_text()
    lines = (line.strip() for line in text.splitlines())
    chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
    text = '\n'.join(chunk for chunk in chunks if chunk)
    return text

async def fetch_and_process_data(skincare_problem):
    
    search_query = f"What are good skincare products to treat {skincare_problem}?"
    product_query = f"The user has {skincare_problem}"
    
    async with aiohttp.ClientSession() as session:
        page_num = 0
        results = []
        while len(results) < total_results_to_fetch:
            page_num += 1
            await google_search(search_query, results)

        urls = [result['links'] for result in results]

        with ThreadPoolExecutor(max_workers=10) as executor:
            loop = asyncio.get_event_loop()
            texts = await asyncio.gather(
                *[loop.run_in_executor(executor, get_all_text_from_url, url) for url in urls]
            )
            
    # prompt gemini to get the correct products
            
    system_prompt = f"""
    You are a skincare expert that reccomends products for specific skin conditions.
    You are given context about products that may be beneficial for the user.
    Given a description of a user's skin condition, provide 1-3 different products that you would believe would be beneficial for the user. Only provide the product names.
    Here is the context:
    {texts}
    """
    
    response = client.models.generate_content(
        model="gemini-2.5-flash", 
        config={"system_instruction":system_prompt,
                "response_schema": list[str],
                "response_mime_type": "application/json"}, 
        contents= [product_query]
    )
    print(response.text)
    parsed_results = json.loads(response.text)
    print(parsed_results[0])
    return parsed_results
        
        # insert openai call to process text information here