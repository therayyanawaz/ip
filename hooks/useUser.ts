import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import type { User } from "@/app/types";

export default function useUser(defaultCountry: string = "US") {
  const [country, setCountry] = useState(defaultCountry);
  const [user, setUser] = useState<User | null>(null);

  const fetchUserData = useCallback(async () => {
    const response = await fetch(
      `https://randomuser.me/api/?nat=${country}&inc=name,phone,id`
    );
    const data = await response.json();
    return data.results[0] as User;
  }, [country]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["user", country],
    queryFn: fetchUserData,
    staleTime: 0, // Get new data on each request
    gcTime: 0, // Don't cache data (cacheTime renamed to gcTime in newer versions)
  });

  // Update user when data is available
  if (data && !user) {
    setUser(data);
  }

  return {
    user,
    setUser,
    isLoading,
    error,
    fetchUser: refetch,
  };
}
