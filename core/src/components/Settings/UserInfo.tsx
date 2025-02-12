"use client";

import { User, Mail, Camera } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState, useRef, useEffect } from "react";

import { uploadProfilePic_FileOrUrl } from "@/actions/storage/upload";
import { editUser } from "@/actions/user";
import { showToast } from "@/components/toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ERROR } from "@/types/error";

export default function UserInfo() {
  const session = useSession();
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatar, setAvatar] = useState("");
  const [values, setValues] = useState({
    name: "",
    username: ""
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !session.data?.user?.id) return;

    setLoading(true);

    try {
      const file = e.target.files?.[0];
      if (!file)
        return showToast({
          message: ERROR.NO_FILE_SELECTED,
          type: "error"
        });

      const result = await uploadProfilePic_FileOrUrl({
        file
      });

      if (result.status === "success") {
        setAvatar((prev) => {
          if (prev) {
            const url = new URL(prev);
            url.searchParams.set("t", Date.now().toString());

            return url.toString();
          }
          return prev;
        });
        showToast({
          message: "Image uploaded successfully",
          type: "success"
        });
      } else if (result.status === "error") {
        showToast({
          type: "error",
          message: result.error
        });
        setLoading(false);
        // clear the input
        fileInputRef.current!.value = "";
      }
    } catch (error) {
      if (error) {
        showToast({
          message: ERROR.UPLOAD_FAILED,
          type: "error"
        });
      }
    } finally {
      setLoading(false);
    }
  };
  const handleNameChange = async () => {
    if (!session.data?.user?.id) return;

    if (values.name === session.data?.user?.name && values.username === session.data?.user?.username) {
      return showToast({
        message: ERROR.NO_CHANGE,
        type: "error"
      });
    }

    try {
      const response = await editUser({
        name: values.name,
        username: values.username
      });

      if (response.status === "success") {
        await session.update();
        showToast({
          message: "Profile updated successfully",
          type: "success"
        });
      } else {
        showToast({
          message: ERROR.UPDATE_FAILED,
          type: "error"
        });
      }
    } catch (error) {
      if (error) {
        showToast({
          message: ERROR.UPDATE_FAILED,
          type: "error"
        });
      }
    }
  };

  useEffect(() => {
    setAvatar(session.data?.user?.image || "");
  }, [session.data?.user?.image]);
  useEffect(() => {
    setValues({
      name: session.data?.user?.name || "",
      username: session.data?.user?.username || ""
    });
  }, [session.data?.user]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Update your profile details here</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <label className="cursor-pointer">
            <Avatar className="h-20 w-20">
              <AvatarImage src={avatar} alt="User avatar" />
              <AvatarFallback>{session.data?.user?.name?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
              multiple={false}
            />
          </label>
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={loading}>
            {loading ? (
              <span>Uploading...</span>
            ) : (
              <>
                <Camera className="mr-2 h-4 w-4" />
                Change Picture
              </>
            )}
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <div className="relative">
            <User className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              id="name"
              value={values.name}
              onChange={(e) =>
                setValues((prev) => ({
                  ...prev,
                  name: e.target.value
                }))
              }
              className="pl-8"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <div className="relative">
            <User className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              id="name"
              value={values.username}
              onChange={(e) =>
                setValues((prev) => ({
                  ...prev,
                  username: e.target.value
                }))
              }
              className="pl-8"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input id="email" type="email" value={session.data?.user?.email || ""} className="pl-8" readOnly />
          </div>
        </div>

        <Button onClick={handleNameChange}>Save Changes</Button>
      </CardContent>
    </Card>
  );
}
