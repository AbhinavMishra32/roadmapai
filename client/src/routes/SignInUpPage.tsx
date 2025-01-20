import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "../hooks/use-toast"
import { Loader2 } from "lucide-react"
import { api } from "@/services/axios"
import { useNavigate } from "react-router-dom"
import { AxiosError } from "axios"
import { useCheckUserToken } from "@/lib/utils"
import { Cookies } from "react-cookie"

type AccountType = "student" | "counsellor" | "recruiter"

export default function SignInUpPage() {
    const [isSignUp, setIsSignUp] = useState(false)
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [onboarded, setOnboarded] = useState();
    const [accountType, setAccountType] = useState<AccountType>("student")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { toast } = useToast()
    const navigate = useNavigate()

    const cookies = new Cookies();
    const userToken = cookies.get('userToken');
    // const accountTypeCookie = cookies.get('accountType');
    // useEffect(() => {
    //     if (userToken && accountTypeCookie) {
    //         navigate(`/onboarding/${accountTypeCookie}`);
    // }
    // }, [userToken, accountTypeCookie, navigate]);

    useEffect(() => {
        if (userToken) {
            navigate('/dashboard');
        }
    })


const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)
        try {
            const response = await api.post('/api/auth', {
                username,
                email,
                password,
                accountType,
                isSignUp
            })
            console.log("Response from signup/signin: ", response)
            const counsellorOnboarded = response.data.counsellor?.onboarded;
            const studentOnboarded = response.data.student?.onboarded;
            console.log(studentOnboarded);
            setOnboarded(counsellorOnboarded || studentOnboarded);
            console.log("Onboarded: ", counsellorOnboarded || studentOnboarded)
            if (!isSignUp) {
                console.log("Token: ", response.data.token)
                document.cookie = `userToken=${response.data.token}; path=/; max-age=604800; samesite=strict`
            }
            toast({
                title: isSignUp ? "Account created" : "Signed in",
                description: `Welcome${isSignUp ? ` ${accountType}` : ""}!`,
            })
            // Uncomment and modify as needed for navigation after successful sign-in/up
            if(onboarded){
                navigate('/dashboard');
            }else{
                navigate(`/onboarding/${accountType}`)
            }
        } catch (error: any) {
            console.log("Error while signup/signin: ", error)
            setError(
                error.response?.data?.message || 
                "An error occurred. Please try again."
            )
            toast({
                title: "Error",
                description: error.response?.data?.message || "An error occurred. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        // <div className="w-full mt-20 max-w-md mx-auto space-y-6 px-4 sm:px-0">
        //     <div className="text-center space-y-2">
        //         <motion.div
        //             initial={{ scale: 0.95, opacity: 0 }}
        //             animate={{ scale: 1, opacity: 1 }}
        //             transition={{ duration: 0.5 }}
        //         >
        //             <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-md">
        //                 <span className="text-2xl font-bold text-white">Logo</span>
        //             </div>
        //         </motion.div>
        //         <h2 className="text-2xl font-semibold tracking-tight text-gray-900">Welcome Back</h2>
        //         <p className="text-sm text-gray-600">Please sign in to your account or create a new one</p>
        //     </div>
        //     <motion.div
        //         initial={{ y: 10, opacity: 0 }}
        //         animate={{ y: 0, opacity: 1 }}
        //         transition={{ duration: 0.5, delay: 0.2 }}
        //     >
        //         <Tabs defaultValue="signin" className="w-full" onValueChange={(value) => setIsSignUp(value === "signup")}>
        //             <TabsList className="grid w-full grid-cols-2 mb-6">
        //                 <TabsTrigger value="signin">Sign In</TabsTrigger>
        //                 <TabsTrigger value="signup">Sign Up</TabsTrigger>
        //             </TabsList>
        //             <TabsContent value="signin">
        //                 <form onSubmit={handleSubmit} className="space-y-4">
        //                     <div className="space-y-2">
        //                         <Label htmlFor="signin-username">Username</Label>
        //                         <Input
        //                             id="signin-username"
        //                             type="text"
        //                             placeholder=""
        //                             required
        //                             value={username}
        //                             onChange={(e) => setUsername(e.target.value)}
        //                             className="w-full"
        //                         />
        //                     </div>
        //                     <div className="space-y-2">
        //                         <Label htmlFor="signin-email">Email</Label>
        //                         <Input
        //                             id="signin-email"
        //                             type="email"
        //                             placeholder="m@example.com"
        //                             required
        //                             value={email}
        //                             onChange={(e) => setEmail(e.target.value)}
        //                             className="w-full"
        //                         />
        //                     </div>
        //                     <div className="space-y-2">
        //                         <Label htmlFor="signin-password">Password</Label>
        //                         <Input
        //                             id="signin-password"
        //                             type="password"
        //                             required
        //                             value={password}
        //                             onChange={(e) => setPassword(e.target.value)}
        //                             className="w-full"
        //                         />
        //                     </div>
        //                     <div className="space-y-2">
        //                         <Label>Account Type</Label>
        //                         <Tabs value={accountType} onValueChange={(value: AccountType) => setAccountType(value)} className="w-full">
        //                             <TabsList className="grid w-full grid-cols-3">
        //                                 <TabsTrigger value="student">Student</TabsTrigger>
        //                                 <TabsTrigger value="counsellor">Counsellor</TabsTrigger>
        //                                 <TabsTrigger value="recruiter">Recruiter</TabsTrigger>
        //                             </TabsList>
        //                         </Tabs>
        //                     </div>
        //                     {error && <p className="text-sm text-red-600">{error}</p>}
        //                     <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white" disabled={isLoading}>
        //                         {isLoading ? (
        //                             <>
        //                                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        //                                 Please wait
        //                             </>
        //                         ) : (
        //                             "Sign In"
        //                         )}
        //                     </Button>
        //                 </form>
        //             </TabsContent>
        //             <TabsContent value="signup">
        //                 <form onSubmit={handleSubmit} className="space-y-4">
        //                     <div className="space-y-2">
        //                         <Label htmlFor="signup-username">Username</Label>
        //                         <Input
        //                             id="signup-username"
        //                             type="text"
        //                             placeholder=""
        //                             required
        //                             value={username}
        //                             onChange={(e) => setUsername(e.target.value)}
        //                             className="w-full"
        //                         />
        //                     </div>
        //                     <div className="space-y-2">
        //                         <Label htmlFor="signup-email">Email</Label>
        //                         <Input
        //                             id="signup-email"
        //                             type="email"
        //                             placeholder="m@example.com"
        //                             required
        //                             value={email}
        //                             onChange={(e) => setEmail(e.target.value)}
        //                             className="w-full"
        //                         />
        //                     </div>
        //                     <div className="space-y-2">
        //                         <Label htmlFor="signup-password">Password</Label>
        //                         <Input
        //                             id="signup-password"
        //                             type="password"
        //                             required
        //                             value={password}
        //                             onChange={(e) => setPassword(e.target.value)}
        //                             className="w-full"
        //                         />
        //                     </div>
        //                     <div className="space-y-2">
        //                         <Label>Account Type</Label>
        //                         <Tabs value={accountType} onValueChange={(value: AccountType) => setAccountType(value)} className="w-full">
        //                             <TabsList className="grid w-full grid-cols-3">
        //                                 <TabsTrigger value="student">Student</TabsTrigger>
        //                                 <TabsTrigger value="counsellor">Counsellor</TabsTrigger>
        //                                 <TabsTrigger value="recruiter">Recruiter</TabsTrigger>
        //                             </TabsList>
        //                         </Tabs>
        //                     </div>
        //                     {error && <p className="text-sm text-red-600">{error}</p>}
        //                     <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white" disabled={isLoading}>
        //                         {isLoading ? (
        //                             <>
        //                                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        //                                 Please wait
        //                             </>
        //                         ) : (
        //                             "Sign Up"
        //                         )}
        //                     </Button>
        //                 </form>
        //             </TabsContent>
        //         </Tabs>
        //     </motion.div>
        //     <p className="text-center text-sm text-gray-600 mt-6">
        //         By signing in, you agree to our{" "}
        //         <a href="#" className="text-blue-600 hover:underline">
        //             Terms of Service
        //         </a>{" "}
        //         and{" "}
        //         <a href="#" className="text-blue-600 hover:underline">
        //             Privacy Policy
        //         </a>
        //         .
        //     </p>
        // </div>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-yellow-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-2xl">
                <div className="text-center space-y-6">
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                            <span className="text-3xl font-bold text-white">MM</span>
                        </div>
                    </motion.div>
                    <h2 className="text-3xl font-extrabold text-gray-900">Welcome to MentorMap</h2>
                    <p className="text-sm text-gray-600">Your journey to career success starts here</p>
                </div>
                <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <Tabs defaultValue="signin" className="w-full" onValueChange={(value) => setIsSignUp(value === "signup")}>
                        <TabsList className="grid w-full grid-cols-2 mb-8 bg-yellow-100 p-1 rounded-lg">
                            <TabsTrigger value="signin" className="rounded-md data-[state=active]:bg-white data-[state=active]:text-yellow-600 transition-all">Sign In</TabsTrigger>
                            <TabsTrigger value="signup" className="rounded-md data-[state=active]:bg-white data-[state=active]:text-yellow-600 transition-all">Sign Up</TabsTrigger>
                        </TabsList>
                        <TabsContent value="signin">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="signin-username" className="text-sm font-medium text-gray-700">Username</Label>
                                    <Input
                                        id="signin-username"
                                        type="text"
                                        placeholder="Your username"
                                        required
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full rounded-lg border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="signin-email" className="text-sm font-medium text-gray-700">Email</Label>
                                    <Input
                                        id="signin-email"
                                        type="email"
                                        placeholder="you@example.com"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full rounded-lg border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="signin-password" className="text-sm font-medium text-gray-700">Password</Label>
                                    <Input
                                        id="signin-password"
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full rounded-lg border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">Account Type</Label>
                                    <Tabs value={accountType} onValueChange={(value: AccountType) => setAccountType(value)} className="w-full">
                                        <TabsList className="grid w-full grid-cols-3 bg-yellow-100 p-1 rounded-lg">
                                            <TabsTrigger value="student" className="rounded-md data-[state=active]:bg-white data-[state=active]:text-yellow-600 transition-all">Student</TabsTrigger>
                                            <TabsTrigger value="counsellor" className="rounded-md data-[state=active]:bg-white data-[state=active]:text-yellow-600 transition-all">Counsellor</TabsTrigger>
                                            <TabsTrigger value="recruiter" className="rounded-md data-[state=active]:bg-white data-[state=active]:text-yellow-600 transition-all">Admin</TabsTrigger>
                                        </TabsList>
                                    </Tabs>
                                </div>
                                {error && <p className="text-sm text-red-600">{error}</p>}
                                <Button type="submit" className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white font-bold py-3 rounded-lg transition-all" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Please wait
                                        </>
                                    ) : (
                                        "Sign In"
                                    )}
                                </Button>
                            </form>
                        </TabsContent>
                        <TabsContent value="signup">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="signup-username" className="text-sm font-medium text-gray-700">Username</Label>
                                    <Input
                                        id="signup-username"
                                        type="text"
                                        placeholder="Choose a username"
                                        required
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full rounded-lg border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="signup-email" className="text-sm font-medium text-gray-700">Email</Label>
                                    <Input
                                        id="signup-email"
                                        type="email"
                                        placeholder="you@example.com"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full rounded-lg border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="signup-password" className="text-sm font-medium text-gray-700">Password</Label>
                                    <Input
                                        id="signup-password"
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full rounded-lg border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">Account Type</Label>
                                    <Tabs value={accountType} onValueChange={(value: AccountType) => setAccountType(value)} className="w-full">
                                        <TabsList className="grid w-full grid-cols-3 bg-yellow-100 p-1 rounded-lg">
                                            <TabsTrigger value="student" className="rounded-md data-[state=active]:bg-white data-[state=active]:text-yellow-600 transition-all">Student</TabsTrigger>
                                            <TabsTrigger value="counsellor" className="rounded-md data-[state=active]:bg-white data-[state=active]:text-yellow-600 transition-all">Counsellor</TabsTrigger>
                                            <TabsTrigger value="recruiter" className="rounded-md data-[state=active]:bg-white data-[state=active]:text-yellow-600 transition-all">Recruiter</TabsTrigger>
                                        </TabsList>
                                    </Tabs>
                                </div>
                                {error && <p className="text-sm text-red-600">{error}</p>}
                                <Button type="submit" className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white font-bold py-3 rounded-lg transition-all" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Please wait
                                        </>
                                    ) : (
                                        "Sign Up"
                                    )}
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>
                </motion.div>
                <p className="text-center text-sm text-gray-600 mt-8">
                    By signing in, you agree to our{" "}
                    <a href="#" className="text-yellow-600 hover:underline font-medium">
                        Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-yellow-600 hover:underline font-medium">
                        Privacy Policy
                    </a>
                    .
                </p>
            </div>
        </div>
    )
}