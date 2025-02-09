"use client";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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

  const onSubmit = (data: ReportFormValues) => {
    console.log("Report Data:", data);
    alert("Report submitted successfully!");
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
                <option value="Medical Emergency">Medical Emergency</option>
                <option value="Financial Help">Financial Help</option>
                <option value="Food Assistance">Food Assistance</option>
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
