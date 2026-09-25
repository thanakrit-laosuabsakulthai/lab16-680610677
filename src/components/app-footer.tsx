interface AppFooterProps {
  firstName: string;
  lastName: string;
  studentId: string;
}


export default function Footer({ studentId, firstName, lastName }: AppFooterProps) {
    return (
        <footer className="border-t p-4 text-center text-xs text-muted-foreground">
            <div className="container mx-auto text-center">
                <p>จัดทำโดย {firstName} {lastName} - {studentId}</p>
            </div>
        </footer>
    );
}