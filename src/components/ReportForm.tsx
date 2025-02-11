/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { toast } from "sonner";

const reportSchema = z.object({
  name: z.string().min(1, "Name is required"),
  mobileNumber: z.string().regex(/^\d{11}$/, "Mobile number must be 11 digits"),
  address: z.string().min(1, "Address is required"),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  cause: z.string().min(1, "Please select a cause"),
  otherCause: z.string().optional(),
});

type ReportFormValues = z.infer<typeof reportSchema>;

const ReportForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      name: "",
      mobileNumber: "",
      address: "",
      location: { lat: 0, lng: 0 },
      cause: "",
      otherCause: "",
    },
  });

  const selectedCause = watch("cause");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setValue("location", {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => console.error(error)
      );
    }
  }, [setValue]);

  const onSubmit = async (data: ReportFormValues) => {
    console.log("Report Data:", data);

    try {
      const response = await axios.post(
        "https://midwife-backend.vercel.app/api/v1/reports",
        data
      );

      if (response.status === 201 || response.status === 200) {
        toast.success("Report submitted successfully!");
      } else {
        toast.error("Something went wrong!");
      }
    } catch (error: any) {
      console.error("Error submitting report:", error);
      toast.error(error.response?.data?.error || "Failed to submit report.");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold text-center mb-4">Report Form</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-medium">Name:</label>
          <input {...register("name")} className="w-full p-2 border rounded" />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block font-medium">Mobile No:</label>
          <input
            {...register("mobileNumber")}
            className="w-full p-2 border rounded"
          />
          {errors.mobileNumber && (
            <p className="text-red-500">{errors.mobileNumber.message}</p>
          )}
        </div>

        <div>
          <label className="block font-medium">Address:</label>
          <input
            {...register("address")}
            className="w-full p-2 border rounded"
          />
          {errors.address && (
            <p className="text-red-500">{errors.address.message}</p>
          )}
        </div>

        <div>
          <label className="block font-medium">Cause of Asking Help:</label>
          <Controller
            control={control}
            name="cause"
            render={({ field }) => (
              <select {...field} className="w-full p-2 border rounded">
                <option value="">Select a cause</option>
                <option
                  className="text-red-500"
                  value="তীব্র পেটে ব্যথা বা খিঁচুনি"
                >
                  তীব্র পেটে ব্যথা বা খিঁচুনি
                </option>
                <option
                  className="text-red-500"
                  value="প্রচণ্ড রক্তপাত বা রক্ত ​​জমাট বাঁধা"
                >
                  প্রচণ্ড রক্তপাত বা রক্ত জমাট বাঁধা
                </option>
                <option
                  className="text-red-500"
                  value="তীব্র মাথাব্যথা বা ঝাপসা দৃষ্টি"
                >
                  তীব্র মাথাব্যথা বা ঝাপসা দৃষ্টি
                </option>
                <option
                  className="text-red-500"
                  value="নিরন্তর বমি এবং পানিশূন্যতা"
                >
                  নিরন্তর বমি এবং পানিশূন্যতা
                </option>
                <option
                  className="text-red-500"
                  value="ভ্রূণের নড়াচড়া কমে যাওয়া বা একেবারেই না থাকা (২৪ সপ্তাহ পরে)"
                >
                  ভ্রূণের নড়াচড়া কমে যাওয়া বা একেবারেই না থাকা (২৪ সপ্তাহ
                  পরে)
                </option>
                <option
                  className="text-red-500"
                  value="হাত, মুখ বা পায়ে তীব্র ফোলাভাব"
                >
                  হাত, মুখ বা পায়ে তীব্র ফোলাভাব
                </option>
                <option
                  className="text-red-500"
                  value="ঠান্ডা লাগার সাথে উচ্চ জ্বর"
                >
                  ঠান্ডা লাগার সাথে উচ্চ জ্বর
                </option>
                <option
                  className="text-red-500"
                  value="বেদনাদায়ক বা জ্বালাপোড়া প্রস্রাব"
                >
                  বেদনাদায়ক বা জ্বালাপোড়া প্রস্রাব
                </option>
                <option
                  className="text-red-500"
                  value="৩৭ সপ্তাহের আগে হঠাৎ তরল পদার্থ বের হয়ে আসা"
                >
                  ৩৭ সপ্তাহের আগে হঠাৎ তরল পদার্থ বের হয়ে আসা
                </option>
                <option
                  className="text-red-500"
                  value="শ্বাসকষ্ট বা বুকে ব্যথা"
                >
                  শ্বাসকষ্ট বা বুকে ব্যথা
                </option>
                <option
                  className="text-yellow-700"
                  value="হালকা বমি বমি ভাব এবং বমি"
                >
                  হালকা বমি বমি ভাব এবং বমি
                </option>
                <option
                  className="text-yellow-700"
                  value="ক্লান্তি এবং মাথা ঘোরা"
                >
                  ক্লান্তি এবং মাথা ঘোরা
                </option>
                <option
                  className="text-yellow-700"
                  value="পা বা হাত হালকা ফোলা"
                >
                  পা বা হাত হালকা ফোলা
                </option>
                <option
                  className="text-yellow-700"
                  value="কোষ্ঠকাঠিন্য এবং ফুলে যাওয়া"
                >
                  কোষ্ঠকাঠিন্য এবং ফুলে যাওয়া
                </option>
                <option className="text-yellow-700" value="পিঠে ব্যথা">
                  পিঠে ব্যথা
                </option>
                <option className="text-yellow-700" value="হালকা খিঁচুনি">
                  হালকা খিঁচুনি
                </option>
                <option className="text-yellow-700" value="ঘন ঘন প্রস্রাব">
                  ঘন ঘন প্রস্রাব
                </option>
                <option className="text-yellow-700" value="অম্বল এবং বদহজম">
                  অম্বল এবং বদহজম
                </option>
                <option
                  className="text-yellow-700"
                  value="মেজাজ ঘোরা এবং জ্বালাপোড়া"
                >
                  মেজাজ ঘোরা এবং জ্বালাপোড়া
                </option>
                <option className="text-yellow-700" value="স্তনে কোমলতা">
                  স্তনে কোমলতা
                </option>
                <option value="Other">Other</option>
              </select>
            )}
          />
          {errors.cause && (
            <p className="text-red-500">{errors.cause.message}</p>
          )}
        </div>

        {selectedCause === "Other" && (
          <div>
            <label className="block font-medium">Specify Your Problem:</label>
            <input
              {...register("otherCause")}
              className="w-full p-2 border rounded"
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Submit Report
        </button>
      </form>
    </div>
  );
};

export default ReportForm;
