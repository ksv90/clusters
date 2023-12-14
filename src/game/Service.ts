import { EventObject, interpret, InterpreterStatus, StateMachine, Typestate } from '@xstate/fsm';

export type ServiceListener<TContext extends object, TEventObject extends EventObject> = (
  state: StateMachine.State<TContext, TEventObject, Typestate<TContext>>,
) => void;

export type ServiceConfig<TContext extends object, TEventObject extends EventObject> = StateMachine.Config<
  TContext,
  TEventObject,
  Typestate<TContext>
>;

export type ServiceMachine<TContext extends object, TEventObject extends EventObject> = StateMachine.Machine<
  TContext,
  TEventObject,
  Typestate<TContext>
>;

export class Service<TContext extends object, TEventObject extends EventObject> {
  protected currentService?: StateMachine.Service<TContext, TEventObject, Typestate<TContext>>;

  constructor(protected readonly listener: ServiceListener<TContext, TEventObject>) {}

  protected get service(): StateMachine.Service<TContext, TEventObject, Typestate<TContext>> {
    if (!this.currentService) throw new Error('service error');
    return this.currentService;
  }

  public start(machine: ServiceMachine<TContext, TEventObject>): void {
    this.currentService = interpret(machine);
    this.currentService.subscribe(this.listener);
    this.currentService.start();
  }

  public stop(): void {
    if (this.service.status === InterpreterStatus.Stopped) return;
    this.service.stop();
  }

  public send(event: TEventObject['type']): void {
    this.service.send(event);
  }
}
