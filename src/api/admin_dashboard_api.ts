

export async function getTotalGames(): Promise<number> {
  const res = await fetch(`/api/admin/total-games`, {
    method: "GET",
    headers: { "Content-Type": "application/json"},
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch games");
  }

  return data.totalGames;
}

export async function getTotalUsers(): Promise<number> {
  const res = await fetch(`/api/admin/total-users`, {
    method: "GET",
    headers: { "Content-Type": "application/json"},
    credentials: "include",
  });

  const data = await res.json();
    console.log(`Total Users: ${data}`)


  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch games");
  }

  console.log(`Total Users: ${data.totalUsers}`)
  return data.totalUsers;
}

export async function getTotalSales() {
    try {
      const response  = await fetch(`/api/admin/total-sales`, {
        method: "GET",
        credentials: "include"
      });
      
      const data = await response.json();


    if (!response.ok) {
      throw new Error(data.message || "Failed to get total sales");
    }

    return data.totalSales;

  } catch (error) {
    throw error;
  }
  }


  export async function getOrderSummary() {
    try {
      const response  = await fetch(`/api/admin/order-summary`, {
        method: "GET",
        credentials: "include"
      });
      
      const data = await response.json();


    if (!response.ok) {
      throw new Error(data.message || "Failed to get total sales");
    }

    return data.summary;

  } catch (error) {
    throw error;
  }
  }    
  