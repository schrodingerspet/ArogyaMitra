import { useQuery } from "@tanstack/react-query";
import { fetchDocuments, fetchTimeline } from "../../api/records";

export const useDocuments = () => {
  return useQuery({
    queryKey: ["records", "documents"],
    queryFn: fetchDocuments,
  });
};

export const useTimeline = () => {
  return useQuery({
    queryKey: ["records", "timeline"],
    queryFn: fetchTimeline,
  });
};
