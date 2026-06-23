"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { Button } from "@/components/common/Button";
import { useAuth } from "@/hooks/useAuth";
import { useProfileViewModel } from "@/viewmodels/ProfileViewModel";

export function ProfilePanel() {
  const auth = useAuth();
  const { profile, isSaving, error, message, saveProfile, saveEmail, resetPassword } = useProfileViewModel(auth.user?.uid);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isPhotoEditorOpen, setIsPhotoEditorOpen] = useState(false);
  const [photoScale, setPhotoScale] = useState(1);
  const [photoOffsetX, setPhotoOffsetX] = useState(0);
  const [photoOffsetY, setPhotoOffsetY] = useState(0);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setDisplayName(profile?.displayName || auth.user?.displayName || "");
  }, [auth.user?.displayName, profile?.displayName]);

  useEffect(() => {
    setEmail(profile?.email || auth.user?.email || "");
  }, [auth.user?.email, profile?.email]);

  useEffect(() => {
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!auth.user) {
      return;
    }

    try {
      setPhotoError(null);
      const photoEditorSource = photoPreview || profile?.photoURL || auth.user.photoURL;
      const hasPhotoTransform = photoScale !== 1 || photoOffsetX !== 0 || photoOffsetY !== 0;
      const shouldSaveEditedPhoto = Boolean(photoEditorSource && (photoFile || hasPhotoTransform));
      const editedPhotoFile = shouldSaveEditedPhoto && photoEditorSource
        ? await createEditedProfileImage(photoFile ? { file: photoFile } : { url: photoEditorSource }, {
            offsetX: photoOffsetX,
            offsetY: photoOffsetY,
            scale: photoScale
          })
        : null;

      const didSave = await saveProfile({
        displayName,
        email: auth.user.email,
        emailVerified: auth.user.emailVerified,
        photoURL: auth.user.photoURL,
        provider: profile?.provider || (auth.user.providerData.some((provider) => provider.providerId === "google.com") ? "google" : "password")
      }, editedPhotoFile);

      if (didSave) {
        setPhotoFile(null);
        setIsPhotoEditorOpen(false);
        resetPhotoPosition();
      }
    } catch (nextError) {
      console.error(nextError);
      setPhotoError(nextError instanceof Error ? nextError.message : "Could not prepare the profile image.");
    }
  }

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] || null;
    event.target.value = "";
    setPhotoFile(file);
    setPhotoError(null);

    if (!file) {
      setPhotoPreview(null);
      setIsPhotoEditorOpen(false);
      return;
    }

    setPhotoScale(1);
    setPhotoOffsetX(0);
    setPhotoOffsetY(0);
    setPhotoPreview(URL.createObjectURL(file));
    setIsPhotoEditorOpen(true);
  }

  function handlePhotoClick() {
    if (photoURL) {
      setIsPhotoEditorOpen(true);
      return;
    }

    fileInputRef.current?.click();
  }

  function resetPhotoPosition() {
    setPhotoScale(1);
    setPhotoOffsetX(0);
    setPhotoOffsetY(0);
  }

  async function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!auth.user || !email) {
      return;
    }

    await saveEmail(email);
    await auth.refreshUser();
  }

  async function handlePasswordReset() {
    await resetPassword();
  }

  const photoURL = photoPreview || profile?.photoURL || auth.user?.photoURL;
  const avatarLabel = (displayName || auth.user?.email || "U").slice(0, 1).toUpperCase();

  return (
    <section className="panel">
      <h2>Profile</h2>
      {auth.user ? (
        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="profile-editor">
            <button className="profile-photo profile-photo-button" type="button" aria-label="Choose or adjust profile photo" onClick={handlePhotoClick}>
              {photoURL ? <img alt="" src={photoURL} /> : <span>{avatarLabel}</span>}
            </button>
            <label className="profile-photo-field">
              Profile photo
              <input ref={fileInputRef} accept="image/*" type="file" onChange={handlePhotoChange} />
            </label>
          </div>
          {photoURL && isPhotoEditorOpen ? (
            <div className="profile-photo-editor">
              <div className="profile-crop-frame" aria-label="Adjusted profile photo preview">
                <img
                  alt=""
                  src={photoPreview || photoURL || ""}
                  style={{ transform: `translate(${photoOffsetX}px, ${photoOffsetY}px) scale(${photoScale})` }}
                />
              </div>
              <div className="profile-adjustments">
                <label>
                  Size
                  <input
                    max="3"
                    min="1"
                    step="0.05"
                    type="range"
                    value={photoScale}
                    onChange={(event) => setPhotoScale(Number(event.target.value))}
                  />
                </label>
                <label>
                  Move left / right
                  <input
                    max="45"
                    min="-45"
                    step="1"
                    type="range"
                    value={photoOffsetX}
                    onChange={(event) => setPhotoOffsetX(Number(event.target.value))}
                  />
                </label>
                <label>
                  Move up / down
                  <input
                    max="45"
                    min="-45"
                    step="1"
                    type="range"
                    value={photoOffsetY}
                    onChange={(event) => setPhotoOffsetY(Number(event.target.value))}
                  />
                </label>
                <div className="profile-adjustment-actions">
                  <Button className="secondary" type="button" onClick={resetPhotoPosition}>Reset</Button>
                  <Button className="secondary" type="button" onClick={() => setIsPhotoEditorOpen(false)}>Done</Button>
                </div>
              </div>
            </div>
          ) : null}
          <label>
            Name or nickname
            <input
              value={displayName}
              placeholder={profile?.displayName || auth.user.displayName || ""}
              onChange={(event) => setDisplayName(event.target.value)}
              required
            />
          </label>
          <Button disabled={isSaving} type="submit">{isSaving ? "Saving..." : "Save profile"}</Button>
        </form>
      ) : (
        <p className="muted">Login is required to edit profile data in Firestore.</p>
      )}
      {auth.user ? (
        <div className="account-settings">
          <form className="form-grid" onSubmit={handleEmailSubmit}>
            <h3>Account email</h3>
            <label>
              Email address
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </label>
            <Button disabled={isSaving || email === auth.user.email} type="submit">
              {isSaving ? "Saving..." : "Update email"}
            </Button>
          </form>
          <div className="form-grid">
            <h3>Password</h3>
            <p className="muted">Send a Firebase password reset email to {auth.user.email || "this account"}.</p>
            <Button className="secondary" disabled={isSaving || !auth.user.email} type="button" onClick={handlePasswordReset}>
              Send password reset email
            </Button>
          </div>
        </div>
      ) : null}
      {message ? <p className="success">{message}</p> : null}
      {photoError ? <p className="error">{photoError}</p> : null}
      {error ? <p className="error">{error}</p> : null}
    </section>
  );
}

type PhotoTransform = {
  offsetX: number;
  offsetY: number;
  scale: number;
};

type PhotoSource = {
  file: File;
} | {
  url: string;
};

function createEditedProfileImage(source: PhotoSource, transform: PhotoTransform): Promise<File> {
  const hasLocalFile = "file" in source;
  const imageUrl = hasLocalFile ? URL.createObjectURL(source.file) : source.url;
  const image = new Image();
  const canvasSize = 512;
  const previewSize = 180;

  return new Promise((resolve, reject) => {
    if (!hasLocalFile) {
      image.crossOrigin = "anonymous";
    }

    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = canvasSize;
      canvas.height = canvasSize;

      const context = canvas.getContext("2d");
      if (!context) {
        if (hasLocalFile) {
          URL.revokeObjectURL(imageUrl);
        }
        reject(new Error("Profile image editor is not available in this browser."));
        return;
      }

      const baseScale = Math.max(canvasSize / image.width, canvasSize / image.height);
      const finalScale = baseScale * transform.scale;
      const drawWidth = image.width * finalScale;
      const drawHeight = image.height * finalScale;
      const offsetRatio = canvasSize / previewSize;
      const drawX = (canvasSize - drawWidth) / 2 + transform.offsetX * offsetRatio;
      const drawY = (canvasSize - drawHeight) / 2 + transform.offsetY * offsetRatio;

      context.clearRect(0, 0, canvasSize, canvasSize);
      context.save();
      context.beginPath();
      context.arc(canvasSize / 2, canvasSize / 2, canvasSize / 2, 0, Math.PI * 2);
      context.clip();
      context.drawImage(image, drawX, drawY, drawWidth, drawHeight);
      context.restore();

      try {
        canvas.toBlob((blob) => {
          if (hasLocalFile) {
            URL.revokeObjectURL(imageUrl);
          }

          if (!blob) {
            reject(new Error("Could not prepare the profile image."));
            return;
          }

          const baseName = hasLocalFile ? source.file.name.replace(/\.[^.]+$/, "") || "profile" : "profile";
          resolve(new File([blob], `${baseName}-profile.png`, { type: "image/png" }));
        }, "image/png");
      } catch (error) {
        if (hasLocalFile) {
          URL.revokeObjectURL(imageUrl);
        }
        console.error(error);
        reject(new Error("Choose a new image file before adjusting this profile photo."));
      }
    };

    image.onerror = () => {
      if (hasLocalFile) {
        URL.revokeObjectURL(imageUrl);
      }
      reject(new Error("Could not load the selected profile image."));
    };

    image.src = imageUrl;
  });
}
