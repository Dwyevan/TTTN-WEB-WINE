const categories = [
    { name: "Red Wine", description: "Rượu vang đỏ" },
    { name: "White Wine", description: "Rượu vang trắng" },
    { name: "Rosé Wine", description: "Rượu vang hồng" },
    { name: "Champagne", description: "Sâm panh" },
    { name: "Sparkling Wine", description: "Rượu vang sủi bọt" },
    { name: "Sweet Wine", description: "Rượu vang ngọt" },
    { name: "Fruit Wine", description: "Rượu hoa quả" },
    { name: "Health Wine", description: "Rượu sức khỏe" },
    { name: "Whisky", description: "Whisky" },
    { name: "Cognac", description: "Cognac" },
    { name: "Sake", description: "Rượu Sake" },
    { name: "Vodka", description: "Vodka" },
    { name: "Accessories", description: "Phụ kiện rượu vang (Dụng cụ mở rượu, ly...)" },
    { name: "Glassware", description: "Ly rượu" }
];

async function seed() {
    try {
        // Fetch all categories first
        const res = await fetch('http://localhost:8080/api/categories');
        const existing = await res.json();
        
        // Delete all existing categories
        for (let cat of existing) {
            await fetch(`http://localhost:8080/api/categories/${cat.id}`, { method: 'DELETE' });
            console.log(`Deleted: ${cat.name}`);
        }

        // Seed new ones
        for (let cat of categories) {
            const res = await fetch('http://localhost:8080/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cat)
            });
            if (res.ok) {
                console.log(`Seeded: ${cat.name}`);
            } else {
                console.error(`Failed to seed ${cat.name}: ${res.status}`);
            }
        }
    } catch (err) {
        console.error(err);
    }
}

seed();
