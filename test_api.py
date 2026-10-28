import asyncio
import httpx
from backend.main import app

async def test():
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as client:
        # Test Status
        r = await client.get("/api/status")
        print("Status Check:", r.status_code, r.json().get("platform"))

        # Test Nutrition Samples
        r = await client.get("/api/nutrition/samples")
        print("Nutrition Samples Count:", len(r.json()))

        # Test Freshness Samples
        r = await client.get("/api/freshness/samples")
        print("Freshness Samples Count:", len(r.json()))

        # Test Hygiene Samples
        r = await client.get("/api/hygiene/samples")
        print("Hygiene Samples Count:", len(r.json()))

        # Test Leftover Recipes
        r = await client.post("/api/cooking/leftover-recipes", json={"available_ingredients": ["Avocado", "Eggs", "Spinach"]})
        recipes = r.json()
        print("Cooking Recipes Generated:", len(recipes), recipes[0].get("title"))

        # Test Frontend Static Serving
        r = await client.get("/")
        print("Frontend Index Served:", r.status_code, "FoodVerse" in r.text)

if __name__ == "__main__":
    asyncio.run(test())
