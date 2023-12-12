import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import {
  AllUsers,
  CreatePost,
  EditPost,
  Explore,
  Home,
  PostDetails,
  Profile,
  Saved,
  UpdateProfile,
} from "./_root/pages";
import SigninForm from "./_auth/Forms/SigninForm.jsx";
import SignupForm from "./_auth/Forms/SignupForm.jsx";
import AuthLayout from "./_auth/AuthLayout.jsx";
import RootLayout from "./_root/RootLayout.jsx";
import { Toaster } from "./components/ui/toaster";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Public Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/sign-in" element={<SigninForm />} />
        <Route path="/sign-up" element={<SignupForm />} />
      </Route>

      {/* Private Routes */}
      <Route element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/all-users" element={<AllUsers />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/update-post/:id" element={<EditPost />} />
        <Route path="/posts/:id" element={<PostDetails />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/profile/:id/liked-posts" element={<Profile />} />
        <Route path="/update-profile/:id" element={<UpdateProfile />} />
      </Route>
    </>
  )
);

const App = () => {
  return (
    <main className="flex h-screen">
      <Toaster />
      <RouterProvider router={router}></RouterProvider>
    </main>
  );
};

export default App;
