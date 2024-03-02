import {CompanionAdvancedFeedbackResult, CompanionFeedbackInfo} from '@companion-module/base';
import {drawPercentage} from '../../image-utils';
import {ResolumeArenaModuleInstance} from '../../index';
import {compositionState, parameterStates} from '../../state';
import {MessageSubscriber} from '../../websocket';

export class CompositionUtils implements MessageSubscriber {
	private resolumeArenaInstance: ResolumeArenaModuleInstance;

	private compositionOpacitySubscriptions: Map<string, Set<string>> = new Map<string, Set<string>>();
	private compositionSpeedSubscriptions: Map<string, Set<string>> = new Map<string, Set<string>>();

	constructor(resolumeArenaInstance: ResolumeArenaModuleInstance) {
		this.resolumeArenaInstance = resolumeArenaInstance;
		this.resolumeArenaInstance.log('debug', 'CompositionUtils constructor called');
	}

	messageUpdates(data: {path: any}, isComposition: boolean) {
		if (isComposition) {
			this.resolumeArenaInstance.getWebsocketApi()?.unsubscribeParam(compositionState.get()!.tempocontroller?.tempo?.id!);
			this.resolumeArenaInstance.getWebsocketApi()?.subscribeParam(compositionState.get()!.tempocontroller?.tempo?.id!);
		}

		if (data.path) {
			if (!!data.path.match(/\/composition\/master/)) {
				this.resolumeArenaInstance.checkFeedbacks('compositionOpacity');
			}
			if (!!data.path.match(/\/composition\/speed/)) {
				this.resolumeArenaInstance.checkFeedbacks('compositionSpeed');
			}
			if (!!data.path.match(/\/composition\/tempocontroller\/tempo/)) {
				this.resolumeArenaInstance.checkFeedbacks('tempo');
			}
		}
	}

	/////////////////////////////////////////////////
	// Opacity
	/////////////////////////////////////////////////

	compositionOpacityFeedbackCallback(_feedback: CompanionFeedbackInfo): CompanionAdvancedFeedbackResult {
		const opacity = parameterStates.get()['/composition/master']?.value;
		if (opacity !== undefined) {
			return {
				text: Math.round(opacity * 100) + '%',
				show_topbar: false,
				png64: drawPercentage(opacity),
			};
		}
		return {text: '?'};
	}

	compositionOpacityFeedbackSubscribe(feedback: CompanionFeedbackInfo) {
		if (!this.compositionOpacitySubscriptions.get('composition')) {
			this.compositionOpacitySubscriptions.set('composition', new Set());
			this.resolumeArenaInstance.getWebsocketApi()?.subscribePath('/composition/master');
		}
		this.compositionOpacitySubscriptions.get('composition')?.add(feedback.id);
	}

	compositionOpacityFeedbackUnsubscribe(feedback: CompanionFeedbackInfo) {
		const compositionOpacitySubscription = this.compositionOpacitySubscriptions.get('composition');
		if (compositionOpacitySubscription) {
			compositionOpacitySubscription.delete(feedback.id);
			if (compositionOpacitySubscription.size === 0) {
				this.resolumeArenaInstance.getWebsocketApi()?.unsubscribePath('/composition/master');
				this.compositionOpacitySubscriptions.delete('composition');
			}
		}
	}
	/////////////////////////////////////////////////
	// Speed
	/////////////////////////////////////////////////

	compositionSpeedFeedbackCallback(_feedback: CompanionFeedbackInfo): CompanionAdvancedFeedbackResult {
		const speed = parameterStates.get()['/composition/speed']?.value;
		if (speed !== undefined) {
			return {
				text: Math.round(speed * 100) + '%',
				show_topbar: false,
				png64: drawPercentage(speed),
			};
		}
		return {text: '?'};
	}

	compositionSpeedFeedbackSubscribe(feedback: CompanionFeedbackInfo) {
		if (!this.compositionSpeedSubscriptions.get('composition')) {
			this.compositionSpeedSubscriptions.set('composition', new Set());
			this.resolumeArenaInstance.getWebsocketApi()?.subscribePath('/composition/speed');
		}
		this.compositionSpeedSubscriptions.get('composition')?.add(feedback.id);
	}

	compositionSpeedFeedbackUnsubscribe(feedback: CompanionFeedbackInfo) {
		const compositionSpeedSubscription = this.compositionSpeedSubscriptions.get('composition');
		if (compositionSpeedSubscription) {
			compositionSpeedSubscription.delete(feedback.id);
			if (compositionSpeedSubscription.size === 0) {
				this.resolumeArenaInstance.getWebsocketApi()?.unsubscribePath('/composition/speed');
				this.compositionSpeedSubscriptions.delete('composition');
			}
		}
	}

	/////////////////////////////////////////////////
	// Tempo
	/////////////////////////////////////////////////

	compositionTempoFeedbackCallback(_feedback: CompanionFeedbackInfo): CompanionAdvancedFeedbackResult {
		const tempo = parameterStates.get()['/composition/tempocontroller/tempo']?.value;
		if (tempo !== undefined) {
			return {
				text: Math.round(tempo * 100) / 100 + '',
				show_topbar: false,
			};
		}
		return {text: '?'};
	}
}
