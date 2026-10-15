"use client";

import { useMemo, useState } from "react";

export type ApplicationStatus =
  | "pending"
  | "under_review"
  | "accepted"
  | "rejected";

export type MembershipApplication = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  country: string;
  city: string;
  area_of_interest: string;
  skills: string | null;
  reason_for_joining: string;
  availability: string;
  reference_number: string;
  submitted_at: string;
  application_status: ApplicationStatus;
  approved_profile_id: string | null;
};

const filters: { value: ApplicationStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "under_review", label: "Under Review" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
];

const statuses: { value: ApplicationStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "under_review", label: "Under Review" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
];

function formatStatus(status: ApplicationStatus) {
  return status === "under_review"
    ? "Under Review"
    : status.charAt(0).toUpperCase() + status.slice(1);
}

function isApprovalResult(
  value: unknown,
): value is { approved_profile_id: string } {
  return (
    typeof value === "object" &&
    value !== null &&
    "approved_profile_id" in value &&
    typeof value.approved_profile_id === "string"
  );
}

export default function ApplicationsList({
  initialApplications,
}: {
  initialApplications: MembershipApplication[];
}) {
  const [applications, setApplications] = useState(initialApplications);
  const [filter, setFilter] = useState<ApplicationStatus | "all">("all");
  const [selectedStatuses, setSelectedStatuses] = useState<
    Record<string, ApplicationStatus>
  >({});
  const [updatingIds, setUpdatingIds] = useState<string[]>([]);
  const [approvingIds, setApprovingIds] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<
    Record<string, { type: "error" | "success"; message: string }>
  >({});

  const visibleApplications = useMemo(
    () =>
      applications.filter(
        (application) =>
          filter === "all" || application.application_status === filter,
      ),
    [applications, filter],
  );

  async function updateStatus(
    application: MembershipApplication,
    nextStatus: ApplicationStatus,
  ) {
    if (
      updatingIds.includes(application.id) ||
      approvingIds.includes(application.id) ||
      nextStatus === application.application_status
    ) {
      return;
    }

    setUpdatingIds((ids) => [...ids, application.id]);
    setFeedback((current) => {
      const next = { ...current };
      delete next[application.id];
      return next;
    });

    try {
      const response = await fetch(
        `/api/admin/applications/${encodeURIComponent(application.id)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ application_status: nextStatus }),
        },
      );
      const result: unknown = await response.json();

      if (
        !response.ok ||
        typeof result !== "object" ||
        result === null ||
        !("application_status" in result) ||
        result.application_status !== nextStatus
      ) {
        const message =
          typeof result === "object" &&
          result !== null &&
          "error" in result &&
          typeof result.error === "string"
            ? result.error
            : "Unable to update application status.";
        throw new Error(message);
      }

      setApplications((items) =>
        items.map((item) =>
          item.id === application.id
            ? { ...item, application_status: nextStatus }
            : item,
        ),
      );
      setSelectedStatuses((current) => ({
        ...current,
        [application.id]: nextStatus,
      }));
      setFeedback((current) => ({
        ...current,
        [application.id]: {
          type: "success",
          message: "Application status updated.",
        },
      }));
    } catch (error) {
      setFeedback((current) => ({
        ...current,
        [application.id]: {
          type: "error",
          message:
            error instanceof Error
              ? error.message
              : "Unable to update application status.",
        },
      }));
    } finally {
      setUpdatingIds((ids) => ids.filter((id) => id !== application.id));
    }
  }

  async function approveMember(application: MembershipApplication) {
    if (
      approvingIds.includes(application.id) ||
      updatingIds.includes(application.id) ||
      application.application_status !== "accepted" ||
      application.approved_profile_id
    ) {
      return;
    }

    setApprovingIds((ids) => [...ids, application.id]);
    setFeedback((current) => {
      const next = { ...current };
      delete next[application.id];
      return next;
    });

    try {
      const response = await fetch(
        `/api/admin/applications/${encodeURIComponent(application.id)}/approve`,
        { method: "POST" },
      );
      const result: unknown = await response.json();

      if (!response.ok || !isApprovalResult(result)) {
        const message =
          typeof result === "object" &&
          result !== null &&
          "error" in result &&
          typeof result.error === "string"
            ? result.error
            : "Unable to approve this membership application.";
        throw new Error(message);
      }

      setApplications((items) =>
        items.map((item) =>
          item.id === application.id
            ? { ...item, approved_profile_id: result.approved_profile_id }
            : item,
        ),
      );
      setFeedback((current) => ({
        ...current,
        [application.id]: {
          type: "success",
          message: "Existing member account approved.",
        },
      }));
    } catch (error) {
      setFeedback((current) => ({
        ...current,
        [application.id]: {
          type: "error",
          message:
            error instanceof Error
              ? error.message
              : "Unable to approve this membership application.",
        },
      }));
    } finally {
      setApprovingIds((ids) => ids.filter((id) => id !== application.id));
    }
  }

  return (
    <>
      <div
        className="mb-6 flex flex-wrap gap-2"
        aria-label="Filter applications by status"
      >
        {filters.map((item) => (
          <button
            key={item.value}
            type="button"
            aria-pressed={filter === item.value}
            onClick={() => setFilter(item.value)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              filter === item.value
                ? "bg-[#0B1B3D] text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {visibleApplications.length === 0 ? (
        <p className="rounded-xl bg-white p-8 text-center text-gray-500">
          No applications found for this status.
        </p>
      ) : (
        <div className="space-y-5">
          {visibleApplications.map((application) => {
            const selectedStatus =
              selectedStatuses[application.id] ??
              application.application_status;
            const isUpdating = updatingIds.includes(application.id);
            const isApproving = approvingIds.includes(application.id);
            const itemFeedback = feedback[application.id];

            return (
              <article
                key={application.id}
                className="rounded-xl bg-white p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-[#0B1B3D]">
                      {application.name}
                    </h2>
                    <p className="mt-1 break-all text-sm text-gray-600">
                      {application.email}
                    </p>
                  </div>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700">
                    {formatStatus(application.application_status)}
                  </span>
                </div>

                <dl className="mt-5 grid gap-x-8 gap-y-4 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="font-semibold text-gray-500">Phone</dt>
                    <dd className="mt-1 text-gray-900">
                      {application.phone || "Not provided"}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-gray-500">Location</dt>
                    <dd className="mt-1 text-gray-900">
                      {application.city}, {application.country}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-gray-500">
                      Area of interest
                    </dt>
                    <dd className="mt-1 text-gray-900">
                      {application.area_of_interest}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-gray-500">Skills</dt>
                    <dd className="mt-1 whitespace-pre-wrap text-gray-900">
                      {application.skills || "Not provided"}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-gray-500">
                      Reason for joining
                    </dt>
                    <dd className="mt-1 whitespace-pre-wrap text-gray-900">
                      {application.reason_for_joining}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-gray-500">
                      Availability
                    </dt>
                    <dd className="mt-1 text-gray-900">
                      {application.availability}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-gray-500">
                      Reference number
                    </dt>
                    <dd className="mt-1 font-mono text-gray-900">
                      {application.reference_number}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-gray-500">Submitted</dt>
                    <dd className="mt-1 text-gray-900">
                      {new Date(application.submitted_at).toLocaleString()}
                    </dd>
                  </div>
                </dl>

                <form
                  className="mt-6 flex flex-wrap items-end gap-3"
                  onSubmit={(event) => {
                    event.preventDefault();
                    void updateStatus(application, selectedStatus);
                  }}
                >
                  <label className="text-sm font-semibold text-gray-700">
                    Update status
                    <select
                      value={selectedStatus}
                      disabled={isUpdating || isApproving}
                      onChange={(event) =>
                        setSelectedStatuses((current) => ({
                          ...current,
                          [application.id]: event.target.value as ApplicationStatus,
                        }))
                      }
                      className="mt-1 block min-h-10 rounded-lg bg-gray-50 px-3 text-sm font-normal text-gray-900 outline-none focus:ring-2 focus:ring-[#1E824C] disabled:opacity-60"
                    >
                      {statuses.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button
                    type="submit"
                    disabled={
                      isUpdating ||
                      isApproving ||
                      selectedStatus === application.application_status
                    }
                    className="min-h-10 rounded-lg bg-[#1E824C] px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isUpdating ? "Saving..." : "Save status"}
                  </button>
                  {application.application_status === "accepted" &&
                    (application.approved_profile_id ? (
                      <p className="text-sm font-semibold text-green-800">
                        Existing member account approved
                      </p>
                    ) : (
                      <button
                        type="button"
                        disabled={isUpdating || isApproving}
                        onClick={() => void approveMember(application)}
                        className="min-h-10 rounded-lg bg-[#0B1B3D] px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-950 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isApproving ? "Approving..." : "Approve member"}
                      </button>
                    ))}
                </form>

                {itemFeedback && (
                  <p
                    role={itemFeedback.type === "error" ? "alert" : "status"}
                    className={`mt-3 text-sm ${
                      itemFeedback.type === "error"
                        ? "text-red-700"
                        : "text-green-700"
                    }`}
                  >
                    {itemFeedback.message}
                  </p>
                )}
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}
