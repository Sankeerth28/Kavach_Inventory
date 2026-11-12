'use client';

import type { ProjectDto } from '@kavach/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type FormEvent, useState } from 'react';
import { Alert, Button, Card, Field, Input, PageHeader, Textarea } from '@/components/ui';
import { api, errorMessage } from '@/lib/session';

function ProjectForm({ project }: { project: ProjectDto }) {
  const queryClient = useQueryClient();
  const [name, setName] = useState(project.name);
  const [address, setAddress] = useState(project.address ?? '');
  const [timezone, setTimezone] = useState(project.timezone);
  const save = useMutation({
    mutationFn: () => api.project.update({ name, address: address || null, timezone }),
    onSuccess: (updated) => queryClient.setQueryData(['project'], updated),
  });
  return (
    <Card className="max-w-xl p-5">
      <form
        className="flex flex-col gap-4"
        onSubmit={(e: FormEvent) => {
          e.preventDefault();
          save.mutate();
        }}
      >
        <Field label="Project code" hint="Set when the project was created. Cannot be changed.">
          {(id) => <Input id={id} value={project.code} disabled />}
        </Field>
        <Field label="Project name">
          {(id) => (
            <Input id={id} value={name} onChange={(e) => setName(e.target.value)} required />
          )}
        </Field>
        <Field label="Site address">
          {(id) => (
            <Textarea id={id} value={address} onChange={(e) => setAddress(e.target.value)} />
          )}
        </Field>
        <Field label="Time zone" hint='Decides what counts as "today" in dashboards and reports.'>
          {(id) => (
            <Input
              id={id}
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              required
            />
          )}
        </Field>
        {save.error && <Alert>{errorMessage(save.error)}</Alert>}
        {save.isSuccess && <Alert tone="success">Saved.</Alert>}
        <div>
          <Button type="submit" disabled={save.isPending}>
            {save.isPending ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </form>
    </Card>
  );
}

export default function SettingsPage() {
  const project = useQuery({ queryKey: ['project'], queryFn: api.project.get });
  return (
    <>
      <PageHeader title="Settings" description="Details of this project." />
      {project.error && <Alert>{errorMessage(project.error)}</Alert>}
      {project.isPending && <p className="text-sm text-muted-foreground">Loading…</p>}
      {project.data && <ProjectForm key={project.data.id} project={project.data} />}
    </>
  );
}
