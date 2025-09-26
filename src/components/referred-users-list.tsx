"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { getReferredUsers, ReferredUser } from "@/app/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Users, UserPlus } from "lucide-react";

export function ReferredUsersList() {
    const { user, loading: authLoading, idToken } = useAuth();
    const [referredUsers, setReferredUsers] = useState<ReferredUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchReferredUsers = async () => {
            if (user && idToken) {
                setIsLoading(true);
                setError(null);
                try {
                    const result = await getReferredUsers({ idToken });
                    if (result.success) {
                        setReferredUsers(result.users || []);
                    } else {
                        setError(result.error || "Failed to fetch referred users.");
                    }
                } catch (e) {
                    setError("An unexpected error occurred.");
                } finally {
                    setIsLoading(false);
                }
            }
        };

        if (!authLoading && user) {
            fetchReferredUsers();
        } else if (!authLoading && !user) {
            setIsLoading(false);
        }

    }, [user, authLoading, idToken]);

    const renderContent = () => {
        if (isLoading || authLoading) {
            return (
                <div className="space-y-2">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                </div>
            );
        }

        if (error) {
            return <p className="text-destructive text-center">{error}</p>;
        }

        if (referredUsers.length === 0) {
            return (
                <div className="text-center text-muted-foreground py-8 px-4 border-2 border-dashed rounded-lg">
                    <div className="flex justify-center mb-4">
                        <UserPlus className="h-12 w-12 text-gray-400" />
                    </div>
                    <p className="font-semibold">You haven't referred anyone yet.</p>
                    <p className="text-sm">Share your referral code to earn 300 CENT for each new user!</p>
                </div>
            );
        }

        return (
            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User Email</TableHead>
                            <TableHead className="text-right">Registration Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {referredUsers.map((refUser, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">{refUser.email}</TableCell>
                                <TableCell className="text-right text-muted-foreground">{refUser.createdAt}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        );
    };

    if (!user && !authLoading) {
        return null; // Don't show this component if the user is not logged in
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="h-6 w-6 text-primary" />
                    Your Referred Users
                </CardTitle>
                <CardDescription>
                    Here is a list of users who signed up using your referral code.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {renderContent()}
            </CardContent>
        </Card>
    );
}