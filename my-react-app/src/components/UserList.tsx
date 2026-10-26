import { useState } from "react";
import type { User } from "../types/users";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "../hooks/useDebounce";

export const UserList = () => {

    const queryClient = useQueryClient();
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);
   
    const { data : usersList, isLoading : isLoadingUsers, error: queryErrorUsers, isFetching : isFetchingUsers, refetch : refetchUsers } = useQuery<User[]>({
        queryKey: ['usersList', debouncedSearch],
        queryFn: async ({ signal }) => {
            return  await fetchUsers({ signal });
        
        },
        staleTime: 1000 * 60,    
        gcTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    });

    const fetchUsers = async ({ signal }: { signal: AbortSignal }) => {
        const keyword = debouncedSearch.trim();

        const url = keyword
            ? `https://jsonplaceholder.typicode.com/users?q=${encodeURIComponent(keyword)}`
            : "https://jsonplaceholder.typicode.com/users";

        const response = await fetch(url, { signal });

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const usersList: User[] = await response.json();
        return usersList;
    };

    return (
        <div>
            <h1>User List</h1>
            <input className="border-2 border-gray-300 rounded-md p-2"
                type="text"
                placeholder="Search by name or email"
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
            <button className="border-2 border-gray-300 rounded-md p-2" onClick={() => refetchUsers()}>Refetch</button>
            <button
                type="button"
                onClick={() =>
                    queryClient.invalidateQueries({
                        queryKey: ['usersList']
                    })
                }
            >
                Invalidate
            </button>
            {isLoadingUsers && <p>Loading...</p>}
        
            {isFetchingUsers && !isLoadingUsers  && <p style={{ color: 'gray' }}>Updating data...</p>}
            {queryErrorUsers && <p>{queryErrorUsers.message}</p>}
            {usersList && Array.isArray(usersList) && usersList.length > 0 ? (
                <ul>
                    {usersList.map((user: User) => (
                        <li key={user.id}>
                        <h2>{user.name}</h2>
                        <p>{user.email}</p>
                        <p>{user.phone}</p>
                        <p>{user.website}</p>
                        <p>{user.company.name}</p>
                    </li>
                    ))}
                </ul>
            ) : (
                <p>No users found</p>
            )}
        </div>
    );
};