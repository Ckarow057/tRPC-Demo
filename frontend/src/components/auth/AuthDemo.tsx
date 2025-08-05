import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useAuth } from '../../contexts/AuthContext';
import { trpc } from '../../lib/trpc';

export function AuthDemo() {
    const { user, isAuthenticated, logout } = useAuth();
    const [profileData, setProfileData] = useState<any>(null);
    const [usersList, setUsersList] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Test protected endpoint - get current user profile
    const testGetProfile = async () => {
        setLoading(true);
        setError('');
        try {
            const profile = await trpc.protected.users.getProfile.query();
            setProfileData(profile);
        } catch (err: any) {
            setError(`Profile fetch failed: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Test protected endpoint - get auth info
    const testAuthInfo = async () => {
        setLoading(true);
        setError('');
        try {
            const authInfo = await trpc.auth.me.query();
            alert(`Token expires: ${new Date(authInfo.tokenInfo.exp! * 1000).toLocaleString()}`);
        } catch (err: any) {
            setError(`Auth info failed: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Test protected endpoint - admin users list
    const testAdminEndpoint = async () => {
        setLoading(true);
        setError('');
        try {
            const users = await trpc.protected.admin.getAllUsersSecure.query();
            setUsersList(users);
        } catch (err: any) {
            setError(`Admin endpoint failed: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Test token refresh
    const testRefreshToken = async () => {
        setLoading(true);
        setError('');
        try {
            await trpc.auth.refresh.mutate();
            alert('Token refreshed successfully!');
        } catch (err: any) {
            setError(`Token refresh failed: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Test update profile
    const testUpdateProfile = async () => {
        setLoading(true);
        setError('');
        try {
            const updatedProfile = await trpc.protected.users.updateProfile.mutate({
                first_name: 'Updated ' + new Date().getTime()
            });
            setProfileData(updatedProfile);
            alert('Profile updated successfully!');
        } catch (err: any) {
            setError(`Profile update failed: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <Card className="max-w-md mx-auto">
                <CardHeader>
                    <CardTitle>Authentication Required</CardTitle>
                    <CardDescription>Please log in to test authentication features.</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* User Info Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        🔐 Authentication Status
                        <Button onClick={logout} variant="outline" size="sm">
                            Logout
                        </Button>
                    </CardTitle>
                    <CardDescription>Current user information and authentication status</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                            <span className="font-semibold text-green-800">Authenticated</span>
                        </div>
                        <div className="space-y-1 text-sm text-green-700">
                            <p><strong>User ID:</strong> {user?.id}</p>
                            <p><strong>Name:</strong> {user?.name}</p>
                            <p><strong>Email:</strong> {user?.email}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Error Display */}
            {error && (
                <Card>
                    <CardContent className="pt-6">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-center mb-2">
                                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                                <span className="font-semibold text-red-800">Error</span>
                            </div>
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Test Buttons */}
            <Card>
                <CardHeader>
                    <CardTitle>🧪 Authentication Tests</CardTitle>
                    <CardDescription>Test various protected endpoints and authentication features</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button
                            onClick={testGetProfile}
                            disabled={loading}
                            className="bg-blue-500 hover:bg-blue-600"
                        >
                            Get My Profile
                        </Button>

                        <Button
                            onClick={testAuthInfo}
                            disabled={loading}
                            className="bg-purple-500 hover:bg-purple-600"
                        >
                            Check Auth Info
                        </Button>

                        <Button
                            onClick={testAdminEndpoint}
                            disabled={loading}
                            className="bg-orange-500 hover:bg-orange-600"
                        >
                            Admin Users List
                        </Button>

                        <Button
                            onClick={testRefreshToken}
                            disabled={loading}
                            className="bg-green-500 hover:bg-green-600"
                        >
                            Refresh Token
                        </Button>

                        <Button
                            onClick={testUpdateProfile}
                            disabled={loading}
                            className="bg-indigo-500 hover:bg-indigo-600"
                        >
                            Update Profile
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Profile Data Display */}
            {profileData && (
                <Card>
                    <CardHeader>
                        <CardTitle>👤 Profile Data</CardTitle>
                        <CardDescription>Data returned from protected profile endpoint</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <pre className="bg-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
                            {JSON.stringify(profileData, null, 2)}
                        </pre>
                    </CardContent>
                </Card>
            )}

            {/* Users List Display */}
            {usersList.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>👥 Admin Users List</CardTitle>
                        <CardDescription>Data from protected admin endpoint ({usersList.length} users)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            {usersList.map((user, index) => (
                                <div key={index} className="bg-slate-100 p-3 rounded-lg text-sm">
                                    <div className="font-semibold">{user.name}</div>
                                    <div className="text-slate-600">{user.email}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Loading Indicator */}
            {loading && (
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-center p-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3"></div>
                            <span className="text-slate-600">Testing authentication...</span>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
