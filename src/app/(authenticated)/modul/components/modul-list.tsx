"use client";

import BaseLoading from "@/components/base-loading";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
	Sheet,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import {
	type ModulListItem,
	type ModulListQuery,
	useModulsQuery,
	useOwnedModulsQuery,
} from "@/queries/useModulQuery";
import { useAuth } from "@/store/useAuth";
import type { Modul } from "@/types/modul";
import { IconFilter, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import SearchableMapelSelect from "../../components/form/searchable-mapel-select";
import SearchableRombelSelect from "../../components/form/searchable-rombel-select";
import SearchableSemesterSelect from "../../components/form/searchable-semester-select";
import SearchableTeacherSelect from "../../components/form/searchable-teacher-select";
import ModulCard from "../../components/modul-card";

// Define useMediaQuery hook here to fix import issue
function useMediaQuery(query: string): boolean {
	// Default to false during SSR
	const [matches, setMatches] = useState(false);

	useEffect(() => {
		// Only run on client
		if (typeof window !== "undefined") {
			// Create the media query list
			const media = window.matchMedia(query);

			// Set the initial value
			setMatches(media.matches);

			// Define our event listener
			const listener = () => {
				setMatches(media.matches);
			};

			// Add the event listener
			media.addEventListener("change", listener);

			// Clean up
			return () => {
				media.removeEventListener("change", listener);
			};
		}
		return undefined;
	}, [query]);

	return matches;
}

export default function ModulList({ owned }: { owned?: boolean }) {
	const [query, setQuery] = useState<ModulListQuery>(null);
	const [open, setOpen] = useState(false);
	const isDesktop = useMediaQuery("(min-width: 768px)");

	const { user } = useAuth();

	const ownedTeacherId = user?.id;
	const ownedQuery = useOwnedModulsQuery(ownedTeacherId);
	const allQuery = useModulsQuery(query || undefined);
	const listQuery = owned ? ownedQuery : allQuery;

	const moduls = (listQuery.data as ModulListItem[] | undefined) || [];

	const isOwned = (modul: Modul) => {
		if (user) {
			return modul.teacher.teacher_id === user.id;
		}
		return false;
	};

	// Function to reset all filters
	const resetFilters = () => {
		setQuery(null);
		setOpen(false);
	};

	return (
		<div className="relative">
			{!owned && (
				<div className="flex justify-start my-3">
					<Sheet open={open} onOpenChange={setOpen}>
						<SheetTrigger asChild>
							<Button variant="default" className="flex items-center gap-2">
								<IconFilter size={18} />
								Filter
							</Button>
						</SheetTrigger>
						<SheetContent
							side={isDesktop ? "right" : "bottom"}
							className="sm:max-w-md"
						>
							<SheetHeader>
								<SheetTitle>Filter Modul</SheetTitle>
							</SheetHeader>
							<div className="flex flex-col gap-4 py-4">
								<div className="space-y-1">
									<h4 className="font-medium text-sm">Guru</h4>
									<SearchableTeacherSelect
										onSelected={(teacher_id) =>
											setQuery((prevQuery) => ({
												...(prevQuery || {}),
												teacher_id,
											}))
										}
									/>
								</div>
								<div className="space-y-1">
									<h4 className="font-medium text-sm">Rombel</h4>
									<SearchableRombelSelect
										onSelected={(rombel_id) =>
											setQuery((prevQuery) => ({
												...(prevQuery || {}),
												rombel_id,
											}))
										}
									/>
								</div>
								<div className="space-y-1">
									<h4 className="font-medium text-sm">Mata Pelajaran</h4>
									<SearchableMapelSelect
										onSelected={(mapel_id) =>
											setQuery((prevQuery) => ({
												...(prevQuery || {}),
												mapel_id,
											}))
										}
									/>
								</div>
								<div className="space-y-1">
									<h4 className="font-medium text-sm">Semester</h4>
									<SearchableSemesterSelect
										onSelected={(semester_id) =>
											setQuery((prevQuery) => ({
												...(prevQuery || {}),
												semester_id,
											}))
										}
									/>
								</div>
							</div>
							<SheetFooter>
								<Button
									variant="destructive"
									onClick={resetFilters}
									className="flex items-center gap-2"
								>
									<IconX size={18} />
									Reset Filter
								</Button>
							</SheetFooter>
						</SheetContent>
					</Sheet>
				</div>
			)}
			<ScrollArea>
				{listQuery.isLoading ? (
					<BaseLoading />
				) : (
					<div className="gap-2 grid grid-cols-12 py-5">
						{moduls && moduls.length > 0 ? (
							moduls.map((modul: ModulListItem) => (
								<ModulCard
									key={modul.uuid}
									modul={modul}
									className="cursor-pointer"
									isUser={isOwned(modul)}
								/>
							))
						) : (
							<div className="col-span-full py-20 text-center">
								Tidak ada modul yang tersedia pada semester ini. Silahkan buat
								modul baru untuk semester ini.
							</div>
						)}
					</div>
				)}
				<ScrollBar orientation="horizontal" />
			</ScrollArea>
		</div>
	);
}
